import { JSX, useState } from "react";
import { HOST } from "src/common/constants";
import { StarRatingProps } from "src/types";

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
  value,
  rating,
  setRating,
  numRatings,
  setNumRatings,
  id,
  user,
  disabled,
  setUserBookRating,
}: StarRatingProps): JSX.Element {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleMouseEnter = (index: number): void => setHoveredIndex(index);
  const handleMouseLeave = (): void => setHoveredIndex(null);

  const handleClick = async (index: number): Promise<void> => {
    if (disabled) return;
    const newRating = index + 1;

    try {
      const response = await fetch(`${HOST}/books/${id}/rating`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ newRating }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update rating: ${response.status}`);
      }

      const { avg_rating, num_ratings } = await response.json();
      setRating(avg_rating);
      setNumRatings(num_ratings);
      setUserBookRating(newRating);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const renderedStars = Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      tabIndex={0}
      onMouseEnter={() => !disabled && handleMouseEnter(index)}
      onMouseLeave={handleMouseLeave}
      onClick={() => handleClick(index)}
      style={{ pointerEvents: disabled ? "none" : "auto" }}
    >
      <Star
        filled={
          !disabled && hoveredIndex != null
            ? index <= hoveredIndex
            : index < Math.round(value ?? 0)
        }
      />
    </span>
  ));

  return (
    <div className="d-flex align-items-center">
      {renderedStars}
      <span className="mx-3 fw-bold fs-3">{(rating ?? 0).toFixed(2)}</span>
      <span>{numRatings} ratings</span>
    </div>
  );
}
