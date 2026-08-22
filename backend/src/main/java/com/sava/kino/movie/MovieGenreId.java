package com.sava.kino.movie;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class MovieGenreId implements Serializable {
    @Column(name = "movie_id")
    private Long movieId;

    @Column(name = "genre_id")
    private Long genreId;

    protected MovieGenreId() {}

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof MovieGenreId))
            return false;

        MovieGenreId that = (MovieGenreId) o;
        return movieId.equals(that.movieId) && genreId.equals(that.genreId);
    }

    @Override
    public int hashCode() {
        return 31 * movieId.hashCode() + genreId.hashCode();
    }
}
