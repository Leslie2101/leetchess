import { useEffect, useRef, useState } from "react";
import { Chess } from 'chess.js'


import './ChessBoard.css';
export interface onDropParams {
  source: string;
  target: string;
  piece: any;
}

interface ChessBoardProps {
  fen: string;
  botMove: string;
  playerAlliance: string;
  playerMoveFeedback?: PlayerMoveFeedback;
  onPlayerMove: (params: onDropParams) => void;
}


export interface PlayerMoveFeedback {
  feedbackId: string;
  playerMove: string;
  isCorrect: boolean;
  isFinalMove: boolean;
  botResponseMove: string;
}

const ChessBoard = ({ fen, botMove, playerAlliance, playerMoveFeedback, onPlayerMove}: ChessBoardProps) => {

  const boardRef = useRef<any>(null);
  const gameRef = useRef<Chess>(new Chess());

  function highlightSquare(square: string) {
    const boardEl = document.getElementById("board1"); // get by ID
    const el = boardEl?.querySelector(`[data-square='${square}']`);
    if (!el) {
      console.log("Square element not found:", square);
      return;
    }
    el.classList.add(`highlight-select`);
  }

  function highlightCheckmate(square: string) {
    const boardEl = document.getElementById("board1"); // get by ID
    const el = boardEl?.querySelector(`[data-square='${square}']`);
    if (!el) {
      console.log("Square element not found:", square);
      return;
    }
    el.classList.add(`highlight-checkmate-deliver`);
  }

  function clearHighlights() {
    const boardEl = document.getElementById("board1"); // get by ID

    boardEl?.querySelectorAll(".highlight-select")
      .forEach(el => el.classList.remove("highlight-select"));
  }




  // ensure piece is only draggable if it's the player's turn
  function onDragStart (source, piece, position, orientation) {
    if ((playerAlliance.toLowerCase() === 'white' && piece.search(/^w/) === -1) ||
        (playerAlliance.toLowerCase() === 'black' && piece.search(/^b/) === -1)) {
      return false
    }
  }


  function onDrop (source, target, piece, newPos, oldPos, orientation) {    
    // snapback if the move is incorrect or not valid
    if (source === target) {
      return 'snapback';
    };
    
    try {
      gameRef.current.move(source + target);
      boardRef.current.position(gameRef.current.fen(), false);
      onPlayerMove({ source, target, piece });
      console.log("move: " + source + target);
    } catch (e){
      return 'snapback';
    }
    
    
  }


  useEffect(() => {
    const timeout = setTimeout(() => {
      const board = Chessboard("board1", {
        onDragStart: onDragStart,
        draggable: true,
        position: fen,
        onDrop: onDrop,
        moveSpeed: 'slow',
        pieceTheme: "/img/chesspieces/{piece}.png",
      });

      gameRef.current = new Chess(fen);

      boardRef.current = board;

      // initial bot move
      gameRef.current.move(botMove);
      board.position(gameRef.current.fen());

      highlightSquare(botMove.slice(0, 2));
      highlightSquare(botMove.slice(2))
      

      return () => board?.destroy?.();
    }, 200);
    
  }, []);

  useEffect(() => {
    if (!playerMoveFeedback) return;

    console.log("Received player move feedback in ChessBoard component:", playerMoveFeedback);
    if (playerMoveFeedback.isCorrect) {
      if (!playerMoveFeedback.isFinalMove) {
        
        // play bot response move
        console.log(gameRef.current.fen());
        gameRef.current.move(playerMoveFeedback.botResponseMove);
        boardRef.current.position(gameRef.current.fen());


        // highlight bot previous move
        clearHighlights();
        highlightSquare(playerMoveFeedback.botResponseMove.slice(0,2));
        highlightSquare(playerMoveFeedback.botResponseMove.slice(2));
      
      
      } else {
        console.log("Puzzle solved! Disabling board.");
        const currentFEN = boardRef.current.fen();
        boardRef.current.destroy();
        const board = Chessboard("board1", {
          draggable: false,
          position: currentFEN,
          pieceTheme: "/img/chesspieces/{piece}.png",
        });

        boardRef.current = board;
        
        // highlight last user move
        clearHighlights();
        highlightSquare(playerMoveFeedback.playerMove.slice(0,2));
        highlightSquare(playerMoveFeedback.playerMove.slice(2));


        if (gameRef.current.isCheckmate()){
          const opponentColor = playerAlliance.toLowerCase() === 'black' ? 'w' : 'b';
          const kingPosition = gameRef.current.findPiece({ type: 'k', color: opponentColor })[0];
          highlightCheckmate(kingPosition);

        }

        
      }
    } else {
      
      gameRef.current.undo();
      boardRef.current.position(gameRef.current.fen());
    }
  }, [playerMoveFeedback]);

  return <div id="board1" style={{ width: 400 }} />;
};

export default ChessBoard;
