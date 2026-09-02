package com.sava.kino.rating;

public record RatingResponse(Long id, Long movieId, Short score, Double avgRating, Long ratingCnt) {
}
