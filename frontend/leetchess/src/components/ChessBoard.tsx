import { useEffect, useRef, useState } from "react";
import { Chess, type PieceSymbol, type Square } from 'chess.js';
import { Chessboard, chessColumnToColumnIndex, defaultPieces, type PieceDropHandlerArgs, type PieceHandlerArgs, type PieceRenderObject} from 'react-chessboard';



import './ChessBoard.css';

export interface onDropParams {
  move: string;
}

interface ChessBoardProps {
  fen: string;
  moveHistory: string[];
  playerAlliance: string;
  playerMoveFeedback?: PlayerMoveFeedback;
  onPlayerMove: (move: string) => void;
}


export interface PlayerMoveFeedback {
  feedbackId: string;
  playerMove: string;
  isCorrect: boolean;
  isFinalMove: boolean;
  botResponseMove: string;
}

const ChessBoard = ({ fen, moveHistory, playerAlliance, playerMoveFeedback, onPlayerMove}: ChessBoardProps) => {

  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [position, setPosition] = useState(fen);
  const gameRef = useRef<Chess>(new Chess(fen));
  const [isEndGame, setIsEndGame] = useState<boolean>(false);
  const [squareStyles, setSquareStyles] = useState<Record<string, React.CSSProperties>>({});
  const [promotionMove, setPromotionMove] = useState<Omit<PieceDropHandlerArgs, 'piece'> | null>(null);


  function highlightCheckmate(square: string) {
    setSquareStyles(prev => {
      const newSquareStyles = {
        ...prev
      };

      newSquareStyles[square] = {
        backgroundColor: 'rgba(255,0,0,0.2)',
      }
      return newSquareStyles;
    });
  }

  function highlightLastMove(from: string, to: string) {
    const highlightStyle = {
      backgroundColor: 'rgba(168, 203, 183, 0.2)',
      boxShadow: 'inset 0 0 0 2px var(--secondary-sage)'
    };

    setSquareStyles(() => ({
      [from]: highlightStyle,
      [to]: highlightStyle
    }));
  }

  // handle piece drop
  function onPieceDrop({
    sourceSquare,
    targetSquare  
  }: PieceDropHandlerArgs) {
    // type narrow targetSquare potentially being null (e.g. if dropped off board)
    if (!targetSquare) {
      return false;
    }

    // target square is a promotion square, check if valid and show promotion dialog
    if (targetSquare.match(/\d+$/)?.[0] === '8' && playerAlliance.toLowerCase() === 'white' || targetSquare.match(/\d+$/)?.[0] === '1' && playerAlliance.toLowerCase() === 'black') {
      // get all possible moves for the source square
      const possibleMoves = gameRef.current.moves({
        square: sourceSquare as Square
      });

      // check if target square is in possible moves (accounting for promotion notation)
      if (possibleMoves.some(move => move.startsWith(`${targetSquare}=`))) {
        setPromotionMove({
          sourceSquare,
          targetSquare
        });
      }

      // return true so that the promotion move is not animated
      // the downside to this is that any other moves made first will not be animated and will reset our move to be animated again e.g. if you are premoving a promotion move and the opponent makes a move afterwards
      return true;
    }

    // not a promotion square, try to make the move now
    try {
      gameRef.current.move({
        from: sourceSquare,
        to: targetSquare
      });

      // update the game state
      setPosition(gameRef.current.fen());

      // return true if the move was successful and send for validation
      // submit move
      onPlayerMove(sourceSquare + targetSquare);

      return true;
    } catch {
      // return false if the move was not successful
      return false;
    }
  }

  // only allow alliance pieces to be dragged
  function canDragPiece({
    piece
  }: PieceHandlerArgs) {
    return !isEndGame && piece.pieceType[0] === playerAlliance.toLowerCase().charAt(0);
  }



  // handle promotion piece select
  function onPromotionPieceSelect(piece: PieceSymbol) {
    try {
      gameRef.current.move({
        from: promotionMove!.sourceSquare,
        to: promotionMove!.targetSquare as Square,
        promotion: piece
      });

      // update the game state
      setPosition(gameRef.current.fen());

      // submit move
      onPlayerMove(promotionMove!.sourceSquare + (promotionMove!.targetSquare as Square) + piece);

    } catch {
      // do nothing
    }

    // reset the promotion move to clear the promotion dialog
    setPromotionMove(null);
  }


  // calculate the left position of the promotion square
  const squareWidth = document.querySelector(`[data-column="a"][data-row="1"]`)?.getBoundingClientRect()?.width ?? 0;
  const promotionSquareLeft = promotionMove?.targetSquare ? squareWidth * chessColumnToColumnIndex(promotionMove.targetSquare.match(/^[a-z]+/)?.[0] ?? '', 8,
  // number of columns
  playerAlliance == 'white' ? 'white' : 'black'// board orientation
  ) : 0;


  // chessboard options
  const chessboardOptions = {
    position: position,
    boardOrientation,
    onPieceDrop,
    canDragPiece,
    squareStyles: squareStyles,
    lightSquareStyle: {
      backgroundColor: 'var(--board-light)'
    },
    darkSquareStyle: {
      backgroundColor: 'var(--board-dark)'
    },
    dropSquareStyle: {
      backgroundColor: 'var(--highlight-yellow)',
      boxShadow: 'inset 0 0 3px 3px var(--primary-peach-hover)'
    },
    
    
    id: 'on-piece-drop',
    
  };

  


  useEffect(() => {
    gameRef.current = new Chess(fen);
    setBoardOrientation(playerAlliance.toLowerCase()=== 'white' ? 'white' : 'black');
    // initial moves

    setTimeout(() => {
      gameRef.current.move(moveHistory[0]);
      setPosition(gameRef.current.fen());
      highlightLastMove(moveHistory[0].slice(0,2), moveHistory[0].slice(2));
      
    }, 400);
    
      
  }, []);


  function makeBotRespond(botMove: string) {
    setTimeout(() => {
      gameRef.current.move(botMove);
      setPosition(gameRef.current.fen());
      highlightLastMove(botMove.slice(0,2), botMove.slice(2));
      
    }, 400);
    
  }

    

  useEffect(() => {
    if (!playerMoveFeedback) return;

    gameRef.current.undo();

    if (playerMoveFeedback.isCorrect) {

      // player make move
      gameRef.current.move(playerMoveFeedback.playerMove);
      setPosition(gameRef.current.fen());
      highlightLastMove(playerMoveFeedback.playerMove.slice(0,2), playerMoveFeedback.playerMove.slice(2));

        
      if (!playerMoveFeedback.isFinalMove) {
        
        // play bot response move
        makeBotRespond(playerMoveFeedback.botResponseMove);
        
          
      } else {
        console.log("Puzzle solved! Disabling board.");
        setIsEndGame(true);
        
        if (gameRef.current.isCheckmate()){
          const opponentColor = playerAlliance.toLowerCase() === 'black' ? 'w' : 'b';
          const kingPosition = gameRef.current.findPiece({ type: 'k', color: opponentColor })[0];
          highlightCheckmate(kingPosition);

        }

        
      }
    } else {
      setPosition(gameRef.current.fen());
    }
  }, [playerMoveFeedback]);

  return <div style={{
    position: 'relative'
  }}>
      {promotionMove ? <div onClick={() => setPromotionMove(null)} onContextMenu={e => {
      e.preventDefault();
      setPromotionMove(null);
    }} style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      zIndex: 1000
    }} /> : null}

      {promotionMove ? <div style={{
      position: 'absolute',
      top: 0,
      left: promotionSquareLeft,
      backgroundColor: 'white',
      width: squareWidth,
      zIndex: 1001,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)'
    }}>
          {(['q', 'r', 'n', 'b'] as PieceSymbol[]).map(piece => <button key={piece} onClick={() => {
        onPromotionPieceSelect(piece);
      }} onContextMenu={e => {
        e.preventDefault();
      }} style={{
        width: '100%',
        aspectRatio: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        border: 'none',
        cursor: 'pointer'
      }}>
              {defaultPieces[`w${piece.toUpperCase()}` as keyof PieceRenderObject]()}
            </button>)}
        </div> : null}

      <Chessboard options={chessboardOptions} />
    </div>;
};

export default ChessBoard;
