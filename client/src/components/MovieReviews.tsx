import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { SPRING } from "src/common/constants";
import { AuthContext } from "src/utils/AuthContext";
import { Review, User } from "src/types";

interface ReviewItemProps {
    review: Review;
    user: User;
    onUpdated: (review: Review) => void;
    onDeleted: (reviewId: number) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
    review,
    user,
    onUpdated,
    onDeleted,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(review.content);
    const isOwner = review.username === user.sub;
    const canDelete = isOwner || user.role === "ROLE_ADMIN";

    const handleEdit = async () => {
        const content = editedContent.trim();
        if (!content)
            return;

        try {
            const res = await fetch(`${SPRING}/api/reviews/${review.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ content }),
            });

            if (!res.ok)
                throw new Error("Failed to update review");

            const updatedReview: Review = await res.json();
            onUpdated(updatedReview);
            setEditedContent(updatedReview.content);
            setIsEditing(false);
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`${SPRING}/api/reviews/${review.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok)
                throw new Error("Failed to delete review");

            onDeleted(review.id);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <article className="border-top border-secondary py-4">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                <div>
                    <h3 className="h5 mb-1 fw-bold">{review.username}</h3>
                    <small className="text-secondary">{new Date(review.createdAt).toLocaleDateString()}</small>
                </div>
                <div className="d-flex gap-2">
                    {isOwner && !isEditing && (
                        <Button variant="outline-light" size="sm" onClick={() => setIsEditing(true)}
                            aria-label="Edit review" title="Edit review">
                            <FaEdit />
                        </Button>
                    )}
                    {canDelete && !isEditing && (
                        <Button variant="outline-danger" size="sm" onClick={handleDelete}
                            aria-label="Delete review" title="Delete review">
                            <FaTrashAlt />
                        </Button>
                    )}
                </div>
            </div>

            {isEditing ? (
                <div className="mt-3">
                    <Form.Control as="textarea" rows={3} maxLength={5000}
                        value={editedContent} onChange={(event) => setEditedContent(event.target.value)}
                        aria-label="Edit review content" />
                    <div className="d-flex gap-2 mt-3">
                        <Button variant="primary" size="sm" onClick={handleEdit} disabled={!editedContent.trim()}>
                            Save
                        </Button>
                        <Button variant="outline-light" size="sm"
                            onClick={() => { setEditedContent(review.content); setIsEditing(false); }}>
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="mb-0 mt-3 text-light">{review.content}</p>
            )}
        </article>
    );
};

interface MovieReviewsProps {
    movieId: number;
}

const MovieReviews: React.FC<MovieReviewsProps> = ({ movieId }) => {
    const { user } = useContext(AuthContext);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newContent, setNewContent] = useState("");

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const res = await fetch(`${SPRING}/api/movies/${movieId}/reviews`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!res.ok)
                    throw new Error("Failed to load reviews");

                const data: Review[] = await res.json();
                setReviews(data);
            } catch (e) {
                console.error(e);
            }
        };

        loadReviews();
    }, [movieId]);

    const handleCreate = async () => {
        const content = newContent.trim();
        if (!content)
            return;

        try {
            const res = await fetch(`${SPRING}/api/movies/${movieId}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ content }),
            });

            if (!res.ok)
                throw new Error("Failed to create review");

            const createdReview: Review = await res.json();
            setReviews((currReviews) => [createdReview, ...currReviews]);
            setNewContent("");
        } catch (e) {
            console.error(e);
        }
    };

    if (!user)
        return null;

    return (
        <section className="text-light mt-4" aria-labelledby="reviews-heading">
            <div className="mb-4">
                <p className="text-uppercase text-primary fw-semibold mb-2">Community</p>
                <h2 id="reviews-heading" className="h3 mb-0 fw-bold">Reviews</h2>
            </div>
            <div className="mb-4">
                <Form.Label htmlFor="new-review" className="fw-semibold">Share your thoughts</Form.Label>
                <Form.Control id="new-review" as="textarea" rows={4} maxLength={5000}
                    value={newContent} onChange={(event) => setNewContent(event.target.value)}
                    placeholder="Write a review" className="mt-2" />
                <div className="d-flex justify-content-between align-items-center gap-3 mt-3">
                    <small className="text-secondary">{newContent.length}/5000</small>
                    <Button variant="primary" onClick={handleCreate} disabled={!newContent.trim()}>Post review</Button>
                </div>
            </div>

            {reviews.length === 0 ? (
                <p className="text-secondary border-top border-secondary pt-4 mb-0">No reviews yet.</p>
            ) : (
                <div>
                    {reviews.map((review) => (
                        <ReviewItem key={review.id} review={review} user={user}
                            onUpdated={(updatedReview) => {
                                setReviews((currReviews) => currReviews.map((r) =>
                                    r.id === updatedReview.id ? updatedReview : r));
                            }}
                            onDeleted={(reviewId) => {
                                setReviews((currReviews) => currReviews.filter((r) => r.id !== reviewId));
                            }}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default MovieReviews;