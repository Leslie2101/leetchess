package com.leslie.chess_puzzle_platform.dto;

import com.leslie.chess_puzzle_platform.models.Theme;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Builder
@Getter
public class PuzzleViewDTO {
    private long id;
    private String fen;
    private int rating;
    private String botMove;
    private String playerAlliance;
    private List<String> themes;
    private String status;
}
