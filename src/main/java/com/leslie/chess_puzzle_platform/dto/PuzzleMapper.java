package com.leslie.chess_puzzle_platform.dto;

import com.leslie.chess_puzzle_platform.models.AttemptStatus;
import com.leslie.chess_puzzle_platform.models.Puzzle;
import com.leslie.chess_puzzle_platform.models.PuzzleStatus;
import com.leslie.chess_puzzle_platform.models.Theme;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PuzzleMapper {

    public PuzzleViewDTO toDTO(Puzzle puzzle){
        return toDTO(puzzle, PuzzleStatus.UNATTEMPTED);
    }

    public PuzzleViewDTO toDTO(Puzzle puzzle, PuzzleStatus status){
        List<String> themes = puzzle.getThemes().stream()
                .map(Theme::getName)
                .sorted()
                .toList();
        String playerAlliance = puzzle.getFen().split(" ")[1].charAt(0) == 'w' ? "Black" : "White";
        return PuzzleViewDTO.builder()
                .id(puzzle.getId())
                .fen(puzzle.getFen())
                .title(puzzle.getTitle())
                .botMove(puzzle.getMoves().split(" ")[0])
                .playerAlliance(playerAlliance)
                .rating(puzzle.getRating())
                .themes(themes)
                .status(status.toString())
                .build();
    }

}
