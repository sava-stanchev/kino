package com.sava.kino.review;

import java.time.Instant;

public record ReviewResponse(Long id, Long movieId, String username, String content,
                             Instant createdAt, Instant updatedAt) {
}
