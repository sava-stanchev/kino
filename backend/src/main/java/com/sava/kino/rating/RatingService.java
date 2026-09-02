package com.sava.kino.rating;

import com.sava.kino.movie.Movie;
import com.sava.kino.movie.MovieNotFoundException;
import com.sava.kino.movie.MovieRepository;
import com.sava.kino.user.User;
import com.sava.kino.user.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
public class RatingService {
    private final RatingRepository ratingRepo;
    private final UserRepository userRepo;
    private final MovieRepository movieRepo;

    public RatingService(RatingRepository ratingRepo, UserRepository userRepo, MovieRepository movieRepo) {
        this.ratingRepo = ratingRepo;
        this.userRepo = userRepo;
        this.movieRepo = movieRepo;
    }

    @Transactional
    public Rating rateMovie(Long movieId, Short score, String username) {
        if (score == null || score < 1 || score > 5)
            throw new IllegalArgumentException("Score must be between 1 and 5");

        Optional<Movie> movieOpt = movieRepo.findById(movieId);
        if (movieOpt.isEmpty())
            throw new MovieNotFoundException();
        Movie movie = movieOpt.get();
        User user = userRepo.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        Optional<Rating> existing = ratingRepo.findByUser_IdAndMovie_Id(user.getId(), movie.getId());

        Rating rating;
        if (existing.isPresent()) {
            rating = existing.get();
            rating.updateScore(score, Instant.now());
        } else {
            Instant now = Instant.now();
            rating = new Rating(user, movie, score, now, now);
        }

        return ratingRepo.save(rating);
    }
}
