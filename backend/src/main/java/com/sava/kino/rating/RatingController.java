package com.sava.kino.rating;

import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
public class RatingController {
    private final RatingService ratingSvc;

    public RatingController(RatingService ratingSvc) {
        this.ratingSvc = ratingSvc;
    }

    @PutMapping("/api/movies/{movieId}/rating")
    public RatingResponse rateMovie(@PathVariable Long movieId,
                               @Valid @RequestBody RatingRequest req, Authentication auth) {
        return ratingSvc.rateMovie(movieId, req.score(), auth.getName());
    }

    @GetMapping("/api/movies/{movieId}/rating")
    public RatingSummaryResponse getMovieRating(@PathVariable Long movieId, Authentication auth) {
        return ratingSvc.getMovieRating(movieId, auth.getName());
    }
}
