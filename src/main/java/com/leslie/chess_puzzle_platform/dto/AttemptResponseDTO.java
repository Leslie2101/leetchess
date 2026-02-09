package com.leslie.chess_puzzle_platform.dto;


import lombok.*;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Builder
@Getter
public class AttemptResponseDTO {
    @Builder.Default
    UUID id = UUID.randomUUID();
    Long attemptId;
    String botMove;
    Boolean isCorrect;
    Boolean isSolved;
    String msg;
}
