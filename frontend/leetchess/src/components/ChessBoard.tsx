import { useEffect, useState } from "react";


export interface onDropParams {
  source: string;
  target: string;
  piece: any;
}

interface ChessBoardProps {
  fen: string;
  botMove: string;
  playerAlliance: string;
  onPlayerMove: (params: onDropParams) => boolean;
}


const ChessBoard = ({ fen, botMove, playerAlliance, onPlayerMove}: ChessBoardProps) => {

  const [bot, setBot] = useState(botMove);

  function onDrop (source, target, piece, newPos, oldPos, orientation) {
    console.log('Source: ' + source)
    console.log('Target: ' + target)
    console.log('Piece: ' + piece)
    console.log('Orientation: ' + orientation)
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')

    // check if the move alliance is correct
    if (playerAlliance.toLowerCase() === "black" && piece.search(/w/) !== -1) {
      
      return 'snapback'
    }

    if (playerAlliance.toLowerCase() === "white" && piece.search(/b/) !== -1) {
      return 'snapback'
    }

    if (!onPlayerMove({ source, target, piece })) {
      return 'snapback';
    };


  }

  const formattedMove = botMove.length === 4
    ? botMove.slice(0, 2) + "-" + botMove.slice(2)
    : botMove;


  useEffect(() => {
    const board = Chessboard("board1", {
      draggable: true,
      position: fen,
      onDrop: onDrop,
      moveSpeed: 'slow',
      pieceTheme: "/img/chesspieces/{piece}.png",
    });

    board.move(formattedMove);
    setBot(formattedMove);

    return () => board?.destroy?.();
  }, []);




  return <div id="board1" style={{ width: 400 }} />;
};

export default ChessBoard;
