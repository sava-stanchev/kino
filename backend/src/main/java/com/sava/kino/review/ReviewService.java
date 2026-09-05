package com.sava.kino.review;

import com.sava.kino.movie.Movie;
import com.sava.kino.movie.MovieNotFoundException;
import com.sava.kino.movie.MovieRepository;
import com.sava.kino.user.User;
import com.sava.kino.user.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepo;
    private final UserRepository userRepo;
    private final MovieRepository movieRepo;

    public ReviewService(ReviewRepository reviewRepo, UserRepository userRepo, MovieRepository movieRepo) {
        this.reviewRepo = reviewRepo;
        this.userRepo = userRepo;
        this.movieRepo = movieRepo;
    }

    @Transactional
    public ReviewResponse createReview(Long movieId, String content, String username) {
        Movie movie = movieRepo.findById(movieId).orElseThrow(MovieNotFoundException::new);
        User user = loadUser(username);

        if (reviewRepo.findByUser_IdAndMovie_Id(user.getId(), movieId).isPresent())
            throw new ReviewAlreadyExistsException();

        Instant now = Instant.now();
        Review review = new Review(user, movie, content, now, now);
        return toRes(reviewRepo.save(review));
    }

    @Transactional
    public ReviewResponse updateReview(Long reviewId, String content, String username) {
        Review review = reviewRepo.findById(reviewId).orElseThrow(ReviewNotFoundException::new);
        User user = loadUser(username);

        if (!review.getUser().getId().equals(user.getId()))
            throw new ReviewForbiddenException();

        review.updateContent(content, Instant.now());
        return toRes(reviewRepo.save(review));
    }

    @Transactional
    public void deleteReview(Long reviewId, Authentication auth) {
        Review review = reviewRepo.findById(reviewId).orElseThrow(ReviewNotFoundException::new);
        String username = auth.getName();
        User user = loadUser(username);

        boolean isAdmin = auth.getAuthorities().stream().anyMatch(authority ->
                authority.getAuthority().equals("ROLE_ADMIN"));
        boolean isOwner = review.getUser().getId().equals(user.getId());
        if (!isOwner && !isAdmin)
            throw new ReviewForbiddenException();

        reviewRepo.delete(review);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviews(Long movieId) {
        if (!movieRepo.existsById(movieId))
            throw new MovieNotFoundException();
        List<Review> reviews = reviewRepo.findByMovie_IdOrderByCreatedAtDesc(movieId);
        List<ReviewResponse> res = new ArrayList<>();

        for (Review r : reviews) {
            res.add(toRes(r));
        }

        return res;
    }

    private User loadUser(String username) {
        return userRepo.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    private ReviewResponse toRes(Review review) {
        return new ReviewResponse(review.getId(), review.getMovie().getId(), review.getUser().getUsername(),
                review.getContent(), review.getCreatedAt(), review.getUpdatedAt());
    }
}
