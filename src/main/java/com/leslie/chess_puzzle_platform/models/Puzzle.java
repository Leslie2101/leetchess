package com.leslie.chess_puzzle_platform.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Puzzle {

    @Id
    @GeneratedValue
    private Long id;
    private String fen;
    private int rating;
    private String moves;
    private String themes;



}
