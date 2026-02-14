package com.leslie.chess_puzzle_platform.dto;

import com.leslie.chess_puzzle_platform.models.PuzzleAttempt;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class AttemptMapper {
    public AttemptViewDto toViewDTO(PuzzleAttempt attempt){

        List<String> moves = List.of(attempt.getPuzzle().getMoves().split(" "));

        return AttemptViewDto.builder()
                .id(attempt.getId())
                .submittedTime(attempt.getDateTime())
                .status(attempt.getStatus().toString())
                .initalFen(attempt.getPuzzle().getFen())
                .movesMade(moves.subList(0, attempt.getMovesPlayed()))
                .build();
    }
}
