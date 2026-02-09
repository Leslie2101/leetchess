package com.leslie.chess_puzzle_platform.exceptions;

public class InvalidMoveException extends RuntimeException {
    public InvalidMoveException(String msg) {
        super(msg);
    }
}
