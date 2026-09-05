import { JSX, useState } from "react";
import { SPRING } from "src/common/constants";
import { RatingMutationRes, StarRatingProps } from "src/types";

function Star({ filled }: { filled: boolean }): JSX.Element {
  const starClass = `star-icon${filled ? " star-icon-filled" : ""}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={starClass}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}

export default function StarRating({
    movieId, avgRating, ratingCnt, currUserRating, onRatingUpdated
}: StarRatingProps): JSX.Element {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const handleMouseEnter = (idx: number): void => setHoveredIdx(idx);
    const handleMouseLeave = (): void => setHoveredIdx(null);

    const handleClick = async (idx: number): Promise<void> => {
        const score = idx + 1;

        try {
            const res = await fetch(`${SPRING}/api/movies/${movieId}/rating`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ score }),
            });

            if (!res.ok)
                throw new Error(`Failed to update rating: ${res.status}`);

            const data: RatingMutationRes = await res.json();
            onRatingUpdated(data);
        } catch (e) {
            console.error(e);
        }
    };

    const renderedStars = Array.from({ length: 5 }, (_, idx) => (
        <span
            key={idx}
            tabIndex={0}
            className="d-inline-flex"
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(idx)}
        >
            <Star filled={hoveredIdx != null ? idx <= hoveredIdx : idx < (currUserRating ?? 0)} />
        </span>
    ));

    return (
        <div className="d-flex flex-wrap align-items-center gap-3">
            <div className="d-flex align-items-center gap-1">
                {renderedStars}
            </div>
            <span className="fw-bold fs-3 lh-1">{avgRating.toFixed(2)}</span>
            <span className="text-secondary">{ratingCnt} ratings</span>
        </div>
    );
}
