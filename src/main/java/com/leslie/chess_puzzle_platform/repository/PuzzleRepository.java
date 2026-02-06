package com.leslie.chess_puzzle_platform.repository;

import com.leslie.chess_puzzle_platform.models.Puzzle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PuzzleRepository extends JpaRepository<Puzzle, Long> {
}
