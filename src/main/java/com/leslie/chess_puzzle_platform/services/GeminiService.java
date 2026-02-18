package com.leslie.chess_puzzle_platform.services;

import com.leslie.chess_puzzle_platform.models.Puzzle;
import com.leslie.chess_puzzle_platform.models.PuzzleAttempt;
import com.leslie.chess_puzzle_platform.repository.PuzzleAttemptRepository;
import com.leslie.chess_puzzle_platform.repository.PuzzleRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class GeminiService {
    private final ChatClient chatClient;
    private final PuzzleAttemptRepository attemptRepository;
    private final PuzzleRepository puzzleRepository;

    public GeminiService(ChatClient.Builder builder,
                         PuzzleAttemptRepository attemptRepository,
                         PuzzleRepository puzzleRepository){
        this.chatClient = builder.build();
        this.attemptRepository = attemptRepository;
        this.puzzleRepository = puzzleRepository;
    }
    public String getAnswer(String question) {
        String response = chatClient
                .prompt()
                .user(question)
                .call()
                .content();
        return response;
    }


    public String answerAttemptQuestion(long puzzleId, long attemptId, String question){


        Puzzle puzzle = puzzleRepository.findById(puzzleId).orElseThrow();
        final String[] moves = puzzle.getMoves().split(" ");


        String[] movesPlayed = attemptRepository.findById(attemptId)
                .map(attempt -> Arrays.copyOfRange(moves, 0, attempt.getMovesPlayed()))
                .orElseGet(() -> Arrays.copyOfRange(moves, 0, 1));

        String updatedFen = ChessGameUtils.getUpdatedFen(puzzle.getFen(), movesPlayed);

        String userAlliance = PuzzleService.getAlliance(puzzle).equals("b")
                ? "white"
                : "black";

        String userPrompt = buildPrompt(
                updatedFen,
                question,
                userAlliance
        );

        System.out.println(userPrompt);


        String response = chatClient
                .prompt("You are a chess puzzle consultant for the player. Give brief explanation/hints to users' questions related to the puzzle. Do not give explicit answer to the puzzle.")
                .user(userPrompt)
                .call()
                .content();

        return response;
    }


    private String buildPrompt(String fen, String question, String alliance){
        return """
                Process this question from the player:
                
                Current board FEN: %s
                User question: %s
                User's alliance: %s
                
                Instructions:
                - Focus on positional ideas, tactics, and piece activity.
                - Explain reasoning clearly in a way a learner can understand, but do NOT reveal the exact solution
                - Optional: provide insight into threats, weak pieces, and plans.
                - Answer using the language used to ask the question. For example: if the question is in French, answer in French.
                """.formatted(fen, question, alliance);
    }


}
