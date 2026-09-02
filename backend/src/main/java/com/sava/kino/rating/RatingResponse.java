package com.sava.kino.rating;

import java.time.Instant;

public record RatingResponse(Long id, Long movieId, Short score,
                             Instant createdAt, Instant updatedAt) {
}
