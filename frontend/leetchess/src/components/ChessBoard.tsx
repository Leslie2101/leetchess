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
  moveHistory: string[];
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

function extractSquaresFromSAN(san: string): {
  from?: string;
  to?: string;
} {
  // match all board squares like e4, g1, h8
  const squares = san.match(/[a-h][1-8]/g) || [];

  if (squares.length === 0) {
    return {};
  }

  if (squares.length === 1) {
    return { to: squares[0] };
  }

  return {
    from: squares[0],
    to: squares[squares.length - 1],
  };
}

const ChessBoard = ({ fen, moveHistory, playerAlliance, playerMoveFeedback, onPlayerMove}: ChessBoardProps) => {

  const boardRef = useRef<any>(null);
  const gameRef = useRef<Chess>(new Chess());

  function highlightLastMove(from: string, to: string) {
      [from, to].forEach(coord => {
          const squareEl = document.querySelector(`[data-square="${coord}"]`);
          if (squareEl) {
              squareEl.classList.add('highlight-last-move');
          }
      });
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

    boardEl?.querySelectorAll(".square-55d63")
      .forEach(el => el.classList.remove("highlight-legal-move", "highlight-last-move"));
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

    console.log(piece);

    onPlayerMove({ source, target, piece });
    
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

      // initial moves

      moveHistory.forEach(move => {
        gameRef.current.move(move);
        board.position(gameRef.current.fen());

        clearHighlights();
        highlightLastMove(move.slice(0, 2), move.slice(2));
        
      });
      

      // highlightSquare(botMove.slice(0, 2));
      // highlightSquare(botMove.slice(2))
      

      return () => board?.destroy?.();
    }, 200);
    
  }, []);

  useEffect(() => {
    if (!playerMoveFeedback) return;

    console.log("Received player move feedback in ChessBoard component:", playerMoveFeedback);
    if (playerMoveFeedback.isCorrect) {

      // player make move
      gameRef.current.move(playerMoveFeedback.playerMove);
      boardRef.current.position(gameRef.current.fen(), false);
      // clearHighlights();
      // console.log(playerMoveFeedback.playerMove);
      // highlightLastMove(playerMoveFeedback.playerMove.slice(0,2), playerMoveFeedback.playerMove.slice(2));
        
      if (!playerMoveFeedback.isFinalMove) {
        
        // play bot response move
        console.log(gameRef.current.fen());
        gameRef.current.move(playerMoveFeedback.botResponseMove);
        boardRef.current.position(gameRef.current.fen());


        // highlight bot previous move
        clearHighlights();
        highlightLastMove(playerMoveFeedback.botResponseMove.slice(0,2), playerMoveFeedback.botResponseMove.slice(2));

          
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
        highlightLastMove(playerMoveFeedback.playerMove.slice(0,2), playerMoveFeedback.playerMove.slice(2));


        if (gameRef.current.isCheckmate()){
          const opponentColor = playerAlliance.toLowerCase() === 'black' ? 'w' : 'b';
          const kingPosition = gameRef.current.findPiece({ type: 'k', color: opponentColor })[0];
          highlightCheckmate(kingPosition);

        }

        
      }
    } else {
      
      // gameRef.current.undo();
      boardRef.current.position(gameRef.current.fen());
    }
  }, [playerMoveFeedback]);

  return <div id="board1" style={{ width: 400 }} />;
};

export default ChessBoard;
