package com.leslie.chess_puzzle_platform.repository;

import com.leslie.chess_puzzle_platform.models.AttemptStatus;
import com.leslie.chess_puzzle_platform.models.Puzzle;

public interface PuzzleWithStatus {
    Puzzle getPuzzle();
    AttemptStatus getStatus();
}