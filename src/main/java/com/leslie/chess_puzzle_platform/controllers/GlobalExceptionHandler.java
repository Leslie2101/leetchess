package com.leslie.chess_puzzle_platform.controllers;

import com.leslie.chess_puzzle_platform.dto.ApiError;
import com.leslie.chess_puzzle_platform.exceptions.InvalidMoveException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(InvalidMoveException.class)
    public ResponseEntity<ApiError> handleInvalidMove(InvalidMoveException ex) {
        return ResponseEntity
                .badRequest() // 400
                .body(new ApiError("INVALID_MOVE", ex.getMessage()));
    }
}
