package com.leslie.chess_puzzle_platform.controllers;

import com.leslie.chess_puzzle_platform.dto.*;
import com.leslie.chess_puzzle_platform.models.User;
import com.leslie.chess_puzzle_platform.repository.UserRepository;
import com.leslie.chess_puzzle_platform.services.PuzzleAttemptService;
import com.leslie.chess_puzzle_platform.services.PuzzleService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/puzzles")
@CrossOrigin(origins = "http://localhost:5173")
@AllArgsConstructor
public class PuzzleController {

    final PuzzleService puzzleService;
    final PuzzleMapper mapper;
    final AttemptMapper attemptMapper;
    final UserRepository userRepository;
    final PuzzleAttemptService puzzleAttemptService;

    @GetMapping()
    public PagedModel<PuzzleViewDTO> getPuzzles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int ratingMin,
            @RequestParam(defaultValue = "3000") int ratingMax,
            @RequestParam(required = false) List<String> themes,
            @RequestParam(defaultValue = "true") boolean ascending,
            @RequestParam(defaultValue = "id") String sortBy,
            @AuthenticationPrincipal OAuth2User principal) {

        // set fallback sort by aspect
        Set<String> allowedSortByAspects = Set.of("id", "rating");
        if (!allowedSortByAspects.contains(sortBy)) sortBy = "id";

        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        if (principal == null){
            return new PagedModel<>(puzzleService.getFilteredPuzzles(ratingMin, ratingMax, search, themes, pageable));
        }


        Optional<User> optionalUser = userRepository.findByUsername(principal.getAttribute("email"));
        return optionalUser.map(user -> new PagedModel<>(puzzleService.getAllPuzzlesForUser(user, ratingMin, ratingMax, search, themes, pageable)))
                .orElseGet(() -> new PagedModel<>(puzzleService.getFilteredPuzzles(ratingMin, ratingMax, search, themes, pageable)));

    }

    @GetMapping("/{id}")
    ResponseEntity<Optional<PuzzleViewDTO>> getPuzzle(@PathVariable("id") long puzzleId){
        return ResponseEntity.ok(puzzleService.findById(puzzleId).map(mapper::toDTO));
    }

    @PostMapping("/{puzzleId}/attempts")
    ResponseEntity<AttemptResponseDTO> startAttemptForPuzzle(@PathVariable long puzzleId,
                                                             @RequestBody MoveRequest moveRequest,
                                                             @AuthenticationPrincipal OAuth2User principal){

        Optional<User> optionalUser = userRepository.findByUsername(principal.getAttribute("email"));


        return ResponseEntity.ok(optionalUser.map(user -> puzzleAttemptService.makeMove(user, puzzleId, null, moveRequest.move()))
                .orElseGet(() -> puzzleAttemptService.makeMove(null, puzzleId, null, moveRequest.move())));
    }

    @PostMapping("/{puzzleId}/attempts/{attemptId}/moves")
    ResponseEntity<AttemptResponseDTO> submitMoveForPuzzle(@PathVariable long puzzleId,
                                                           @PathVariable long attemptId,
                                                           @RequestBody MoveRequest moveRequest,
                                                           @AuthenticationPrincipal OAuth2User principal){

        Optional<User> optionalUser = userRepository.findByUsername(principal.getAttribute("email"));

        return ResponseEntity.ok(optionalUser
                        .map(user -> puzzleAttemptService.makeMove(user, puzzleId, attemptId, moveRequest.move()))
                        .orElseGet(() -> puzzleAttemptService.makeMove(null, puzzleId, attemptId, moveRequest.move()))
        );
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

    @GetMapping("/daily-puzzle-id")
    public ResponseEntity<DailyPuzzleIdResponse> getRandomDaily(){
        long id = puzzleService.getRandomPuzzleIdByDay();
        return ResponseEntity.ok(new DailyPuzzleIdResponse(id));
    }


    public record DailyPuzzleIdResponse(long id){};

}
