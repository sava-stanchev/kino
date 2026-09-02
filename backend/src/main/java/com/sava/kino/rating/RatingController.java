package com.sava.kino.rating;

import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RatingController {
    private final RatingService ratingSvc;

    public RatingController(RatingService ratingSvc) {
        this.ratingSvc = ratingSvc;
    }

    @PutMapping("/api/movies/{movieId}/rating")
    public RatingResponse rateMovie(@PathVariable Long movieId,
                               @Valid @RequestBody RatingRequest req, Authentication auth) {
        Rating rating = ratingSvc.rateMovie(movieId, req.score(), auth.getName());
        return new RatingResponse(rating.getId(), rating.getMovie().getId(), rating.getScore(),
                rating.getCreatedAt(), rating.getUpdatedAt());
    }
}
