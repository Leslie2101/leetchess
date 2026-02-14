package com.leslie.chess_puzzle_platform.repository;

import com.leslie.chess_puzzle_platform.models.PuzzleAttempt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface PuzzleAttemptRepository extends JpaRepository<PuzzleAttempt, Long> {

    Page<PuzzleAttempt> findByPuzzleId(Long puzzleId, Pageable pageable);

    @Query("""
    SELECT pa
    FROM PuzzleAttempt pa
    WHERE pa.user.id = :userId
      AND pa.puzzle.id IN :puzzleIds
""")
    List<PuzzleAttempt> findByUserAndPuzzleIds(UUID userId, List<Long> puzzleIds);
}
