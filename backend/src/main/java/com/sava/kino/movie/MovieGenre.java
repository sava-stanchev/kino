package com.sava.kino.movie;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "movie_genres")
public class MovieGenre {
    @EmbeddedId
    private MovieGenreId id;

    protected MovieGenre() {}
}
