import { useEffect, useState } from "react";
import { Badge, Card, Col, Container, Row, Stack } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { SPRING } from "src/common/constants";
import Loader from "src/components/Loader";
import StarRating from "src/components/StarRating";
import { MovieDetailResponse, MovieRatingSummary } from "src/types";

const MovieDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<MovieDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const [avgRating, setAvgRating] = useState(0);
    const [ratingCnt, setRatingCnt] = useState(0);
    const [currUserRating, setCurrUserRating] = useState<number | null>(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoading(true);
                setErr(null);

                const tok = localStorage.getItem("token");
                const [movieRes, ratingRes] = await Promise.all([
                    fetch(`${SPRING}/api/movies/${id}`, {
                        headers: {Authorization: `Bearer ${tok}`}
                    }),
                    fetch(`${SPRING}/api/movies/${id}/rating`, {
                        headers: {Authorization: `Bearer ${tok}`}
                    }),
                ]);

                if (movieRes.status === 404)
                    throw new Error("movie not found");
                if (!movieRes.ok || !ratingRes.ok)
                    throw new Error("unable to load movie");

                const movieData: MovieDetailResponse = await movieRes.json();
                const ratingData: MovieRatingSummary = await ratingRes.json();       
                setMovie(movieData);
                setAvgRating(ratingData.avgRating);
                setRatingCnt(ratingData.ratingCnt);
                setCurrUserRating(ratingData.currUserRating);
            } catch (e) {
                setErr(e instanceof Error ? e.message : "unable to load movie");
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    if (loading)
        return <Container className="my-5"><Loader /></Container>;
    if (err)
        return <Container className="my-5"><p>{err}</p></Container>;
    if (!movie)
        return null;

    return (
        <Container className="my-5 py-3">
            <Card bg="dark" border="secondary" className="shadow-lg text-light">
                <Row className="g-0">
                    <Col lg={4} className="d-flex align-items-center justify-content-center p-4 p-lg-5">
                        <Card.Img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="rounded shadow"
                        />
                    </Col>
                    <Col lg={8}>
                        <Card.Body className="h-100 d-flex flex-column justify-content-center p-4 p-lg-5">
                            <Card.Subtitle className="mb-2 text-uppercase text-primary fw-semibold">
                                Movie detail
                            </Card.Subtitle>
                            <Card.Title as="h1" className="display-5 fw-bold mb-4">
                                {movie.title}
                            </Card.Title>

                            <Stack direction="horizontal" gap={2} className="flex-wrap mb-4">
                                {movie.releaseDate && (
                                    <Badge bg="secondary" className="px-3 py-2">
                                        Released {movie.releaseDate}
                                    </Badge>
                                )}
                                {movie.runtime !== null && (
                                    <Badge bg="secondary" className="px-3 py-2">
                                        {movie.runtime} min
                                    </Badge>
                                )}
                                <Badge bg="primary" className="px-3 py-2">
                                    Language: {movie.lang}
                                </Badge>
                            </Stack>

                            <div className="mb-4">
                                <StarRating movieId={movie.id} avgRating={avgRating} ratingCnt={ratingCnt}
                                    currUserRating={currUserRating} onRatingUpdated={(data) => {
                                        setCurrUserRating(data.score);
                                        setAvgRating(data.avgRating);
                                        setRatingCnt(data.ratingCnt);
                                    }}
                                />
                            </div>

                            <div className="border-start border-primary border-3 ps-3">
                                <Card.Text className="mov-desc lead mb-0">
                                    {movie.desc}
                                </Card.Text>
                            </div>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default MovieDetail;
