package com.sava.kino.rating;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUser_IdAndMovie_Id(Long userId, Long movieId);

    @Query("select coalesce(avg(r.score), 0.0) from Rating r where r.movie.id = :movieId")
    Double avg(@Param("movieId") Long movieId);

    long countByMovie_Id(Long movieId);
}
