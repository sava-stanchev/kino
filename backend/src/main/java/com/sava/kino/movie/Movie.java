package com.sava.kino.movie;

import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "movies")
public class Movie {
    protected Movie() {}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String desc;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "runtime_minutes")
    private Integer runtime;

    @Column(name = "poster_url")
    private String posterUrl;

    @Column(name = "original_language", nullable = false, length = 2)
    private String lang;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDesc() {
        return desc;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public String getLang() {
        return lang;
    }

    public Integer getRuntime() {
        return runtime;
    }
}
