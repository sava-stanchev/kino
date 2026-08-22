package com.sava.kino.movie;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MovieController {
    private final MovieService movieSvc;

    public MovieController(MovieService movieSvc) {
        this.movieSvc = movieSvc;
    }

    @GetMapping("/api/movies")
    public List<Movie> getMovies() {
        return movieSvc.findAllMovies();
    }
}
