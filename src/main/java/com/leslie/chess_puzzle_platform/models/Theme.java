package com.leslie.chess_puzzle_platform.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.*;


@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Theme {
    @Id
    @GeneratedValue
    private Long id;

    @Column(unique = true)
    private String name;
}
