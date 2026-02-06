package com.leslie.chess_puzzle_platform.controllers;


import com.leslie.chess_puzzle_platform.services.PuzzleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/problems")
public class AdminPuzzleController {

    private final PuzzleService service;

    @PostMapping(value = "/upload", consumes = {"multipart/form-data"})
    public ResponseEntity<Integer> uploadPuzzles(
            @RequestPart("file") MultipartFile file
            ) throws IOException {
        return ResponseEntity.ok(service.uploadPuzzles(file));
    }

}
