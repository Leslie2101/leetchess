package com.leslie.chess_puzzle_platform.models;

import lombok.Getter;

@Getter
public enum AttemptStatus {
    IN_PROGRESS("attempted"),
    SOLVED("solved");

    private final String name;

    AttemptStatus(String name) {
        this.name = name;
    }

}
