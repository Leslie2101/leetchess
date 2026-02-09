import { useEffect, useRef, useState } from "react";
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
  const previousFENRef = useRef<string>(fen);

  function highlightSquare(square: string, color: "white" | "black" | 'red'= "white") {
    const boardEl = document.getElementById("board1"); // get by ID
    const el = boardEl?.querySelector(`[data-square='${square}']`);
    if (!el) {
      console.log("Square element not found:", square);
      return;
    }
    el.classList.add(`highlight-${color}`);
  }

  function clearHighlights() {
    const boardEl = document.getElementById("board1"); // get by ID

    boardEl?.querySelectorAll(".highlight-white, .highlight-black")
      .forEach(el => el.classList.remove("highlight-white", "highlight-black"));
  }




  // ensure piece is only draggable if it's the player's turn
  function onDragStart (source, piece, position, orientation) {
    if ((playerAlliance.toLowerCase() === 'white' && piece.search(/^w/) === -1) ||
        (playerAlliance.toLowerCase() === 'black' && piece.search(/^b/) === -1)) {
      return false
    }
  }


  function onDrop (source, target, piece, newPos, oldPos, orientation) {
    console.log('Source: ' + source)
    console.log('Target: ' + target)
    console.log('Piece: ' + piece)
    console.log('Orientation: ' + orientation)
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')

    
    // snapback if the move is incorrect or not valid
    if (source === target) {
      return 'snapback';
    };
    previousFENRef.current = boardRef.current.fen();
    
    
    onPlayerMove({ source, target, piece });
    
    
  }

  const formattedMove = botMove.length === 4
    ? botMove.slice(0, 2) + "-" + botMove.slice(2)
    : botMove;


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

      board.move(formattedMove);
      boardRef.current = board;

      return () => board?.destroy?.();
    }, 200);
    
  }, []);

  useEffect(() => {
    if (!playerMoveFeedback) return;

    console.log("Received player move feedback in ChessBoard component:", playerMoveFeedback);
    if (playerMoveFeedback.isCorrect) {
      if (!playerMoveFeedback.isFinalMove) {
        console.log("test");
        const formattedBotMove = playerMoveFeedback.botResponseMove.length === 4
          ? playerMoveFeedback.botResponseMove.slice(0, 2) + "-" + playerMoveFeedback.botResponseMove.slice(2)
          : playerMoveFeedback.botResponseMove;

        boardRef.current.move(formattedBotMove);    
        clearHighlights();
        highlightSquare(playerMoveFeedback.botResponseMove.slice(0, 2), "black");
        highlightSquare(playerMoveFeedback.botResponseMove.slice(2), "black");


        console.log("Bot move: " + formattedBotMove);
      
      
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
      }
    } else {
      
      boardRef.current.position(previousFENRef.current);

    }
  }, [playerMoveFeedback]);

  return <div id="board1" style={{ width: 400 }} />;
};

export default ChessBoard;
