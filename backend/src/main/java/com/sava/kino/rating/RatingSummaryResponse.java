package com.sava.kino.rating;

public record RatingSummaryResponse(Double avgRating, Long ratingCnt, Short currUserRating) {
}
