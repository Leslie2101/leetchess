package com.leslie.chess_puzzle_platform.controllers;

import com.leslie.chess_puzzle_platform.models.Puzzle;
import com.leslie.chess_puzzle_platform.repository.PuzzleRepository;
import com.leslie.chess_puzzle_platform.services.PuzzleService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/puzzles")
@AllArgsConstructor
public class PuzzleController {

    final PuzzleService puzzleService;

    @GetMapping()
    public Page<Puzzle> getPuzzles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String theme,
            @RequestParam(defaultValue = "0") int ratingMin,
            @RequestParam(defaultValue = "3000") int ratingMax,
            @RequestParam(defaultValue = "true") boolean ascending,
            @RequestParam(defaultValue = "id") String sortBy) {

        // set fallback sort by aspect
        Set<String> allowedSortByAspects = Set.of("id", "rating");
        if (!allowedSortByAspects.contains(sortBy)) sortBy = "id";

        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return puzzleService.findPuzzles(ratingMin, ratingMax, pageable);
    }

    @GetMapping("/{id}")
    Optional<Puzzle> getPuzzle(@PathVariable("id") long puzzleId){
        return puzzleService.findById(puzzleId);
    }

    @PostMapping("/{puzzleId}/submissions/{submissionId}/moves")
    void submitMoveForPuzzle(@PathVariable long puzzleId,
                             @PathVariable long submissionId){

    }
}
