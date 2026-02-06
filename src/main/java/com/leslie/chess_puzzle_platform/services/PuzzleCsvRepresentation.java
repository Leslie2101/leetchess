package com.leslie.chess_puzzle_platform.services;


import com.opencsv.bean.CsvBindByName;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PuzzleCsvRepresentation {

    @CsvBindByName(column = "FEN")
    private String fen;

    @CsvBindByName(column = "Moves")
    private String moves;

    @CsvBindByName(column = "Rating")
    private int rating;

    @CsvBindByName(column = "Themes")
    private String themes;
}
