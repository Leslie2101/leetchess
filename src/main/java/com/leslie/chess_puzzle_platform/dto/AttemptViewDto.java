package com.leslie.chess_puzzle_platform.dto;

import jakarta.persistence.Entity;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class AttemptViewDto {
    Long id;
    String status;
    String initalFen;
    List<String> movesMade;
    LocalDateTime submittedTime;
}
