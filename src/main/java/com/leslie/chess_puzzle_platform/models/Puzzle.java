package com.leslie.chess_puzzle_platform.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Setter
@Getter
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
    private String title;

    @ManyToMany
    @JoinTable(
            name = "puzzle_theme",
            joinColumns = @JoinColumn(name="puzzle_id"),
            inverseJoinColumns = @JoinColumn(name="theme_id")
    )
    private Set<Theme> themes;

}
