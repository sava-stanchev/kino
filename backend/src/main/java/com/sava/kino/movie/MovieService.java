package com.sava.kino.movie;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MovieService {
    private final MovieRepository movieRepo;

    public MovieService(MovieRepository movieRepo) {
        this.movieRepo = movieRepo;
    }

    public List<MovieResponse> findAllMovies() {
        List<Movie> movies = movieRepo.findAll();
        List<MovieResponse> res = new ArrayList<>();

        for (Movie mov : movies) {
            Long id = mov.getId();
            String title = mov.getTitle();
            String desc = mov.getDesc();
            String posterUrl = mov.getPosterUrl();

            MovieResponse movieRes = new MovieResponse(id, title, desc, posterUrl);
            res.add(movieRes);
        }

        return res;
    }
}
