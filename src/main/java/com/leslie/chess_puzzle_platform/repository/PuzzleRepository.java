package com.leslie.chess_puzzle_platform.repository;

import com.leslie.chess_puzzle_platform.models.Puzzle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

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

    @Query("""
        SELECT p AS puzzle,
               COALESCE(pa.status, 'UNATTEMPTED') AS status
        FROM Puzzle p
        LEFT JOIN PuzzleAttempt pa
               ON pa.puzzle = p AND pa.user.id = :userId
    """)
    Page<PuzzleWithStatus> findAllWithStatus(@Param("userId") UUID userId, Pageable pageable);

    @Query("""
        SELECT p AS puzzle,
               COALESCE(pa.status, 'UNATTEMPTED') AS status
        FROM Puzzle p
        LEFT JOIN PuzzleAttempt pa
               ON pa.puzzle = p AND pa.user.id = :userId
        WHERE p.rating BETWEEN :ratingMin AND :ratingMax
    """)
    Page<PuzzleWithStatus> findByRatingWithStatus(@Param("userId") UUID userId, int ratingMin, int ratingMax, Pageable pageable);

    @Query("""
        SELECT p AS puzzle,
               COALESCE(pa.status, 'UNATTEMPTED') AS status
        FROM Puzzle p
        JOIN p.themes t
        LEFT JOIN PuzzleAttempt pa
               ON pa.puzzle = p AND pa.user.id = :userId
        WHERE p.rating BETWEEN :ratingMin AND :ratingMax AND t.name IN :themes
    """)
    Page<PuzzleWithStatus> findByRatingAndThemesWithStatus(@Param("userId") UUID userId, int ratingMin, int ratingMax, List<String> themes, Pageable pageable);
}


