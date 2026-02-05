package com.leslie.chess_puzzle_platform.controllers;

import com.leslie.chess_puzzle_platform.models.Puzzle;
import jakarta.websocket.server.PathParam;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/puzzles")
public class Puzzles {

    @GetMapping()
    List<Puzzle> getPuzzles(@RequestParam String theme,
                            @RequestParam int ratingLowerbound,
                            @RequestParam int ratingUpperbound,
                            @RequestParam int page,
                            @RequestParam int size){
        return new ArrayList<>();
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
