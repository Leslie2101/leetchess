package com.leslie.chess_puzzle_platform.controllers;

import com.leslie.chess_puzzle_platform.dto.*;
import com.leslie.chess_puzzle_platform.services.PuzzleAttemptService;
import com.leslie.chess_puzzle_platform.services.PuzzleService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/puzzles")
@AllArgsConstructor
public class PuzzleController {

    final PuzzleService puzzleService;
    final PuzzleMapper mapper;
    final AttemptMapper attemptMapper;
    final PuzzleAttemptService puzzleAttemptService;

    @GetMapping()
    public PagedModel<PuzzleViewDTO> getPuzzles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String theme,
            @RequestParam(defaultValue = "0") int ratingMin,
            @RequestParam(defaultValue = "3000") int ratingMax,
            @RequestParam(required = false) List<String> themes,
            @RequestParam(defaultValue = "true") boolean ascending,
            @RequestParam(defaultValue = "id") String sortBy) {

        // set fallback sort by aspect
        Set<String> allowedSortByAspects = Set.of("id", "rating");
        if (!allowedSortByAspects.contains(sortBy)) sortBy = "id";

        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return new PagedModel<>(puzzleService.searchAndFilter(ratingMin, ratingMax, themes, pageable)
                .map(mapper::toDTO));
    }

    @GetMapping("/{id}")
    ResponseEntity<Optional<PuzzleViewDTO>> getPuzzle(@PathVariable("id") long puzzleId){
        return ResponseEntity.ok(puzzleService.findById(puzzleId).map(mapper::toDTO));
    }

    @PostMapping("/{puzzleId}/attempts")
    ResponseEntity<AttemptResponseDTO> startAttemptForPuzzle(@PathVariable long puzzleId,
                                                             @RequestBody MoveRequest moveRequest){
        return ResponseEntity.ok(puzzleAttemptService.makeMove(puzzleId, null, moveRequest.move()));
    }

    @PostMapping("/{puzzleId}/attempts/{attemptId}/moves")
    ResponseEntity<AttemptResponseDTO> submitMoveForPuzzle(@PathVariable long puzzleId,
                                                           @PathVariable long attemptId,
                                                           @RequestBody MoveRequest moveRequest){

        return ResponseEntity.ok(puzzleAttemptService.makeMove(puzzleId, attemptId, moveRequest.move()));
    }

    @GetMapping("/{puzzleId}/attempts")
    public PagedModel<AttemptViewDto> getAttemptsById(@PathVariable long puzzleId,
                                                      @RequestParam(defaultValue = "0") int page,
                                                      @RequestParam(defaultValue = "10") int size,
                                                      @RequestParam(defaultValue = "true") boolean sortByTimeAscending) {

        Sort sort = sortByTimeAscending ? Sort.by("dateTime").ascending() : Sort.by("dateTime").descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return new PagedModel<>(puzzleAttemptService.getAllAttemptsByPuzzleId(puzzleId, pageable)
                .map(attemptMapper::toViewDTO));
    }

}
