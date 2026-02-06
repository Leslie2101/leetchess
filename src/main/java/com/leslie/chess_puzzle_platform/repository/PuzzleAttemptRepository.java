package com.leslie.chess_puzzle_platform.repository;

import com.leslie.chess_puzzle_platform.models.PuzzleAttempt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PuzzleAttemptRepository extends JpaRepository<PuzzleAttempt, Long> {

    Page<PuzzleAttempt> findByPuzzleId(Long puzzleId, Pageable pageable);
}
