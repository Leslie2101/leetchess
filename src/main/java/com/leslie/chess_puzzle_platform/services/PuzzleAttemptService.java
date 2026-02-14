package com.leslie.chess_puzzle_platform.services;


import com.leslie.chess_puzzle_platform.dto.AttemptResponseDTO;
import com.leslie.chess_puzzle_platform.exceptions.InvalidMoveException;
import com.leslie.chess_puzzle_platform.models.AttemptStatus;
import com.leslie.chess_puzzle_platform.models.Puzzle;
import com.leslie.chess_puzzle_platform.models.PuzzleAttempt;
import com.leslie.chess_puzzle_platform.models.User;
import com.leslie.chess_puzzle_platform.repository.PuzzleAttemptRepository;
import com.leslie.chess_puzzle_platform.repository.PuzzleRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@AllArgsConstructor
public class PuzzleAttemptService {
    final PuzzleRepository puzzleRepository;
    final PuzzleAttemptRepository attemptRepository;


    public Page<PuzzleAttempt> getAllAttemptsByPuzzleId(Long puzzleId, Pageable pageable){
        return attemptRepository.findByPuzzleId(puzzleId, pageable);
    }

    public AttemptResponseDTO makeMove(User user, Long puzzleId, Long attemptId, String move){

        Puzzle puzzle = puzzleRepository.findById(puzzleId).orElseThrow();

        // reject invalid move of staying the same square
        // todo: Properly extract san
        if (move.length() < 4 || move.substring(0,2).equals(move.substring(2,4))){
            throw new InvalidMoveException("Source and destination cannot be the same");
        }

        final String[] moves = puzzle.getMoves().split(" ");
        int nextMoveIndex = 1;
        String botMove = null;

        if (attemptId != null) {
            PuzzleAttempt attempt = attemptRepository.findById(attemptId).orElseThrow();
            nextMoveIndex = attempt.getMovesPlayed();

            if (attempt.getStatus() == AttemptStatus.SOLVED){
                return AttemptResponseDTO.builder()
                        .attemptId(attemptId)
                        .botMove(null)
                        .isSolved(true)
                        .isCorrect(null)
                        .msg("Puzzle is already solved!")
                        .build();
            }
        }


        // solve correctly

        System.out.println("EXPECTED " + moves[nextMoveIndex]);
        System.out.println("ACTUAL " + move);
        if (nextMoveIndex < moves.length && moves[nextMoveIndex].equals(move)){


            // make the move
            nextMoveIndex += 1;

            // let the bot move
            if (nextMoveIndex < moves.length){
                botMove = moves[nextMoveIndex];
                nextMoveIndex += 1;
            };

            // update repo - status is finished if all moves have been made
            PuzzleAttempt puzzleAttempt = PuzzleAttempt.builder()
                    .puzzle(puzzle)
                    .user(user)
                    .movesPlayed(nextMoveIndex)
                    .dateTime(LocalDateTime.now())
                    .status(nextMoveIndex == moves.length ? AttemptStatus.SOLVED : AttemptStatus.IN_PROGRESS)
                    .build();

            if (attemptId != null) puzzleAttempt.setId(attemptId);
            attemptRepository.save(puzzleAttempt);

            // return new object with updated FEN and previous bot move here

            return AttemptResponseDTO.builder()
                    .attemptId(puzzleAttempt.getId())
                    .botMove(botMove)
                    .isCorrect(true)
                    .isSolved(nextMoveIndex == moves.length)
                    .msg("Correct!")
                    .build();
        } else {

            // update repo - status is finished if all moves have been made
            PuzzleAttempt puzzleAttempt = PuzzleAttempt.builder()
                    .puzzle(puzzle)
                    .user(user)
                    .movesPlayed(nextMoveIndex)
                    .dateTime(LocalDateTime.now())
                    .status(AttemptStatus.IN_PROGRESS)
                    .build();

            if (attemptId != null) puzzleAttempt.setId(attemptId);
            attemptRepository.save(puzzleAttempt);


            // solve incorrectly
            return AttemptResponseDTO.builder()
                    .attemptId(puzzleAttempt.getId())
                    .botMove(null)
                    .isSolved(false)
                    .isCorrect(false)
                    .msg("Incorrect move. Try again.")
                    .build();
        }

    }



}
