package com.leslie.chess_puzzle_platform.controllers;

import com.leslie.chess_puzzle_platform.models.Puzzle;
import com.leslie.chess_puzzle_platform.repository.PuzzleRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/puzzles")
@AllArgsConstructor
public class PuzzleController {

    final PuzzleRepository puzzleRepository;

    @GetMapping()
    public List<Puzzle> getPuzzles(
            @RequestParam(required = false) String theme,
            @RequestParam(defaultValue = "0") int ratingLowerbound,
            @RequestParam(defaultValue = "3000") int ratingUpperbound,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return puzzleRepository.findAll();
    }

    @GetMapping("/{id}")
    Puzzle getPuzzle(@PathVariable("id") long puzzleId){
        return new Puzzle();
    }

    @PostMapping("/{puzzleId}/submissions/{submissionId}/moves")
    void submitMoveForPuzzle(@PathVariable long puzzleId,
                             @PathVariable long submissionId){

    }
}
