package com.leslie.chess_puzzle_platform.dto;

import com.leslie.chess_puzzle_platform.models.Puzzle;
import com.leslie.chess_puzzle_platform.models.Theme;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PuzzleMapper {

    public PuzzleViewDTO toDTO(Puzzle puzzle){

        List<String> themes = puzzle.getThemes().stream()
                .map(Theme::getName)
                .toList();
        return PuzzleViewDTO.builder()
                .id(puzzle.getId())
                .fen(puzzle.getFen())
                .botMove(puzzle.getMoves().split(" ")[0])
                .rating(puzzle.getRating())
                .themes(themes)
                .build();
    }

}
