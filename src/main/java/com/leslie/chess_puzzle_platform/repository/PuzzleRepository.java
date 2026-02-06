package com.leslie.chess_puzzle_platform.repository;

import com.leslie.chess_puzzle_platform.models.Puzzle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PuzzleRepository extends JpaRepository<Puzzle, Long> {
    Page<Puzzle> findByRatingBetween(int min, int max, Pageable pageable);
    @Query("""
    SELECT DISTINCT p
    FROM Puzzle p
    JOIN p.themes t
    WHERE p.rating BETWEEN :ratingMin AND :ratingMax
      AND t.name IN :themes
""")
    Page<Puzzle> findByAnyThemeAndRating(
            int ratingMin,
            int ratingMax,
            List<String> themes,
            Pageable pageable
    );
}
