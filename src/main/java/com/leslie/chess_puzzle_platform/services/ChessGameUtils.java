package com.leslie.chess_puzzle_platform.services;

import io.github.wolfraam.chessgame.ChessGame;
import io.github.wolfraam.chessgame.notation.NotationType;

import java.util.List;

public class ChessGameUtils {

    public static String getUpdatedFen(String initialFen, String[] moves){
        ChessGame chessGame = new ChessGame(initialFen);
        chessGame.playMoves(NotationType.UCI, List.of(moves));
        return chessGame.getFen();
    }


}
