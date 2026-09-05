package com.sava.kino.review;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ReviewController {
    private final ReviewService reviewSvc;

    public ReviewController(ReviewService reviewSvc) {
        this.reviewSvc = reviewSvc;
    }

    @GetMapping("/api/movies/{movieId}/reviews")
    public List<ReviewResponse> getReviews(@PathVariable Long movieId) {
        return reviewSvc.getReviews(movieId);
    }

    @PostMapping("/api/movies/{movieId}/reviews")
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponse createReview(@PathVariable Long movieId,
                                       @Valid @RequestBody ReviewRequest req, Authentication auth) {
        return reviewSvc.createReview(movieId, req.content(), auth.getName());
    }

    @PutMapping("/api/reviews/{reviewId}")
    public ReviewResponse updateReview(@PathVariable Long reviewId,
                                       @Valid @RequestBody ReviewRequest req, Authentication auth) {
        return reviewSvc.updateReview(reviewId, req.content(), auth.getName());
    }

    @DeleteMapping("/api/reviews/{reviewId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(@PathVariable Long reviewId, Authentication auth) {
        reviewSvc.deleteReview(reviewId, auth);
    }
}
