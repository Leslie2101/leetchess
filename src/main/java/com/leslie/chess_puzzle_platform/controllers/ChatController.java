package com.leslie.chess_puzzle_platform.controllers;

import com.leslie.chess_puzzle_platform.services.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;


@RestController
public class ChatController {

    public record AIQuestionRequest(String question){};
    public record AIAnswer(String answer){};



    private final GeminiService geminiService;
    public ChatController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }
    @PostMapping("/puzzles/{puzzleId}/attempts/{attemptId}/ai-questions")
    public ResponseEntity<AIAnswer> ask(@PathVariable long puzzleId,
                                       @PathVariable long attemptId,
                                       @RequestBody AIQuestionRequest aiRequest,
                                       @AuthenticationPrincipal OAuth2User principal) {

        return ResponseEntity.ok(new AIAnswer(geminiService.answerAttemptQuestion(puzzleId, attemptId, aiRequest.question())));
    }
}
