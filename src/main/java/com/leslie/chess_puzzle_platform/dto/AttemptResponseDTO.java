package com.leslie.chess_puzzle_platform.dto;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Builder
@Getter
public class AttemptResponseDTO {
    Long id;
    String botMove;
    Boolean isCorrect;
    Boolean isSolved;
    String msg;
}
