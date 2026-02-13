package com.leslie.chess_puzzle_platform.models;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class PuzzleAttempt {

    @Id @GeneratedValue
    Long id;

    @ManyToOne @Nullable
    @JoinColumn(name = "user_id")
    User user;


    @ManyToOne
    @JoinColumn(name = "puzzle_id")
    Puzzle puzzle;


    int movesPlayed;
    LocalDateTime dateTime;

    @Enumerated(EnumType.STRING)
    AttemptStatus status;
}
