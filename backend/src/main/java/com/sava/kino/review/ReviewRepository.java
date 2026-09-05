package com.sava.kino.review;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByUser_IdAndMovie_Id(Long userId, Long movieId);
    List<Review> findByMovie_IdOrderByCreatedAtDesc(Long movieId);
}
