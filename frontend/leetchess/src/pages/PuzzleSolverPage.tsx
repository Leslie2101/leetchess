// PuzzleSolverPage.tsx
import { useEffect, useRef, useState } from "react";
import ChessBoard from "../components/ChessBoard";
import type { onDropParams, PlayerMoveFeedback } from "../components/ChessBoard";
import './PuzzleSolverPage.css';
import { useParams } from "react-router-dom";

// errors, time completion, 


// --- Types ---
interface Attempt {
  id: number;
  status: "solved" | "attempted";
  movesMade: string[];
  finishedTime: string;
  submittedTime: string;
}

interface Puzzle {
  id: number;
  rating: number;
  fen: string;
  botMove: string;
  playerAlliance: "White" | "Black";
  played: string;
  success: number;
  turn: "White" | "Black";
}

interface SidebarProps {
  attempts: Attempt[];
  currentAttempt: number;
  setCurrentAttempt: (id: number) => void;
}

interface BoardProps {
    initialFen: string;
    botMove: string;
    moveHistory: string[];
    playerAlliance: string;
    playerMoveFeedback: PlayerMoveFeedback;
    onMoveDetected: (params: onDropParams) => void;
}

interface RightPanelProps {
  puzzle: Puzzle;
}

// --- Sidebar Component ---
function Sidebar({ attempts, currentAttempt, setCurrentAttempt }: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <div className="section-title">Previous Attempts</div>
        <div className="section-subtitle">TODAY'S SESSION</div>

        <div id="attemptsList">
          {attempts.map((attempt) => (
            <div
              key={attempt.id}
              className={`attempt-item ${currentAttempt === attempt.id ? "active" : ""}`}
              onClick={() => setCurrentAttempt(attempt.id)}
              data-id={attempt.id}
              data-solved={attempt.status === "solved"}
            >
              <div className="attempt-thumb"></div>
              <div className="attempt-info">
                <div className="attempt-id">#{attempt.id}</div>
                <div className="attempt-time">{attempt.finishedTime}</div>
              </div>
              <div className={`attempt-status ${attempt.status.toLowerCase()}`}>
                {currentAttempt === attempt.id ? "Current" : attempt.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Board Component ---
function Board({ moveHistory, botMove, initialFen, playerAlliance, playerMoveFeedback, onMoveDetected }: BoardProps) {


  return (
    <div className="board-container">
      <div className="board-wrapper">
        <div className="chessboard" id="board1">
            <ChessBoard fen={initialFen} botMove={botMove} playerAlliance={playerAlliance} playerMoveFeedback={playerMoveFeedback} onPlayerMove={onMoveDetected}/>
        </div>
      </div>

      <div className="board-footer">
        <div className="move-history">
          {moveHistory.map((move, index) => (
            <div key={index}>
              <span className="move-number">Move {index + 1}:</span>
              <span>{move}</span>
            </div>
          ))}
        </div>

        <div className="controls">
          <button className="control-btn" title="Expand">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
          </button>
          <button className="control-btn" title="Download">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9 2v10m0 0l3-3m-3 3l-3-3m8 5v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2" />
            </svg>
          </button>
          <button className="control-btn" title="Previous Move">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Right Panel Component ---
function RightPanel({ puzzle }: RightPanelProps) {

  const category = (rating: number) => {
      return rating < 900 ? "easy" : rating <= 1500 ? "medium" : "hard";
  }
  return (
      <div className="right-panel">
          <div className="puzzle-info">
              <div className="puzzle-header">
                  <div>
                      <div className="puzzle-number">Puzzle #{puzzle.id}</div>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.5rem" }}>
                      {/* <svg width="16" height="16" fill="none">
                          <circle cx="8" cy="8" r={8} fill="currentColor" opacity={0.2} />
                          <circle cx="8" cy="8" r={3} fill="currentColor" />
                      </svg> */}
                      {/* <span className="difficulty-badge">{puzzle.difficulty}</span> */}
                      </div>
                  </div>
              </div>

              <div className="puzzle-stats">
                  <div className="stat">
                      <div className="stat-label">Rating</div>
                      <div className={`stat-value rating ${category(puzzle.rating)}`}>{puzzle.rating}</div>
                  </div>
                  <div className="stat">
                      <div className="stat-label">Played</div>
                      <div className="stat-value">{puzzle.played}</div>
                  </div>
                  <div className="stat">
                      <div className="stat-label">Success</div>
                      <div className="stat-value">{puzzle.success}%</div>
                  </div>
              </div>

              <div className="turn-indicator">
                  <div className="turn-dot"></div>
                  <div className="turn-text">{puzzle.playerAlliance} to Move</div>
              </div>
          </div>

          <div className="ai-consultant">
              <div className="consultant-header">AI Consultant</div>
                  <div className="chat-messages" id="chatMessages">
                  <div className="chat-placeholder">
                      <div className="chat-placeholder-icon">💬</div>
                      <div>Ask for hints or tactical advice</div>
                  </div>
              </div>
              <div className="chat-input">
                  <input type="text" id="chatInput" placeholder="Ask for a hint..." />
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M5 12h14m0 0l-6-6m6 6l-6 6" />
                  </svg>
              </div>
          </div>

          <div className="action-buttons">
              <button className="hint-btn">
                  <span>💡</span> Get Hint
              </button>
              <button className="submit-btn">Submit Move</button>
          </div>
      </div>
  );
}

const attempts: Attempt[] = [
  { id: 89231, finishedTime: "In Progress", status: "attempted"},
  { id: 89201, finishedTime: "2m 30s", status: "solved"}
];

interface AttemptResponse {
  id: string;
  attemptId: number;
  botMove: string,
  isCorrect: boolean;
  isSolved: boolean;
  msg: string;
}


interface PromotionModalProp {
  isOpen: boolean;
  selectPromotion: (piece: string) => void;  
}

function PromotionModal({isOpen, selectPromotion}: PromotionModalProp){
  return (
    <>
      { isOpen && 
        <div className="promotion-overlay active" id="promotionOverlay">
            <div className="promotion-modal" onClick={(e) => {e.preventDefault();}}>
                <h2 className="promotion-title">Promote Your Pawn! 👑</h2>
                <p className="promotion-subtitle">Choose which piece to promote to</p>
                
                <div className="promotion-pieces">
                    <div className="promotion-piece" onClick={() => selectPromotion('q')} data-piece="queen">
                        <div className="piece-icon" id="queenIcon">♕</div>
                        <div className="piece-name">Queen</div>
                    </div>
                    
                    <div className="promotion-piece" onClick={() => selectPromotion('r')} data-piece="rook">
                        <div className="piece-icon" id="rookIcon">♖</div>
                        <div className="piece-name">Rook</div>
                    </div>
                    
                    <div className="promotion-piece" onClick={() => selectPromotion('b')} data-piece="bishop">
                        <div className="piece-icon" id="bishopIcon">♗</div>
                        <div className="piece-name">Bishop</div>
                    </div>
                    
                    <div className="promotion-piece" onClick={() => selectPromotion('n')} data-piece="knight">
                        <div className="piece-icon" id="knightIcon">♘</div>
                        <div className="piece-name">Knight</div>
                    </div>
                </div>
                
            </div>
        </div>
      }
    </>
  )
}


// --- Main Page ---
export default function PuzzleSolverPage() {
  const [currentAttempt, setCurrentAttempt] = useState<number>(-1);
  const [puzzle, setPuzzle] = useState<Puzzle>();
  const [playerMoveFeedback, setPlayerMoveFeedback] = useState<PlayerMoveFeedback>();
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [playerMove, setPlayerMove] = useState<onDropParams>();
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: string;
    to: string;
  } | null>(null);

const [promotionPiece, setPromotionPiece] = useState<string | null>(null);


  const moveHistory: string[] = ["Nf3 - Nf6"];
  const params = useParams<{ puzzleId: string }>(); // get URL params
  const puzzleId = params.puzzleId; // string value of "1" from /puzzles/1/solve

  useEffect(() => {
      if (!puzzleId) return;

      async function loadPuzzle() {
          try {
              const res = await fetch(`http://localhost:8082/puzzles/${puzzleId}`);
              const json = await res.json();
              setPuzzle(json);
          } catch (err) {
              console.error(err);
          }
      }

      loadPuzzle();
  }, []);

  const onPromotionSelect = (piece: string) => {
    if (!pendingPromotion) return;
    sendMoveToApi(pendingPromotion.from + pendingPromotion.to + piece);
    setPendingPromotion(null);
    setPlayerMove(undefined);
};

  // send move to backend when playerMove state updates, which happens when a move is detected on the chessboard
  useEffect(() => {
    if (!playerMove) return;
    if (isSolved) return;

    // Pawn reached last rank -> promotion needed
    if (playerMove.piece === "wP" && playerMove.target[1] === "8") {
      setPendingPromotion({ from: playerMove.source, to: playerMove.target });
      return; 
    }

    if (playerMove.piece === "bP" && playerMove.target[1] === "1") {
      setPendingPromotion({ from: playerMove.source, to: playerMove.target });
      return;
    }
    
    sendMoveToApi(playerMove.source + playerMove.target);
    setPlayerMove(undefined); // reset playerMove state after sending to API
  }, [playerMove, isSolved]);

  



  async function sendMoveToApi(move: string) {
    // first move being made 
    if (currentAttempt === -1) {
      console.log("Submitting first move for attempt:", JSON.stringify({ move }));
      const res = await fetch(`http://localhost:8082/puzzles/${puzzleId}/attempts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ move })
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json: AttemptResponse = await res.json();
      console.log("Received response for first move:", json);
      setCurrentAttempt(json.attemptId);
      setIsSolved(json.isSolved);
      setPlayerMoveFeedback({
        feedbackId: json.id,
        playerMove: move,
        isCorrect: json.isCorrect,
        isFinalMove: json.isSolved,
        botResponseMove: json.botMove
      });

      console.log("Set player move feedback to:", json);
    
    // subsequent moves
    } else {
      const res = await fetch(`http://localhost:8082/puzzles/${puzzleId}/attempts/${currentAttempt}/moves`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ move })
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json : AttemptResponse = await res.json();
      console.log("Received response for subsequent move:", json);
      setIsSolved(json.isSolved);
      setPlayerMoveFeedback({
        feedbackId: json.id,
        playerMove: move,
        isCorrect: json.isCorrect,
        isFinalMove: json.isSolved,
        botResponseMove: json.botMove
      });
    }

  }


  

  function onMoveDetected(params: onDropParams) {
    console.log("Player move detected:", params.source, params.target);
    // sent move to backend for validation and response
    setPlayerMove(params);
  }

  return (
      <div className="solver-container">
          <Sidebar attempts={attempts} currentAttempt={currentAttempt} setCurrentAttempt={setCurrentAttempt} />
          {puzzle && (
              <>
                  <PromotionModal
                    isOpen={!!pendingPromotion}
                    selectPromotion={onPromotionSelect}
                  />
                  
                  <Board
                      playerMoveFeedback={playerMoveFeedback}
                      playerAlliance={puzzle.playerAlliance} 
                      moveHistory={moveHistory} 
                      initialFen={puzzle.fen} 
                      botMove={puzzle.botMove} 
                      onMoveDetected={onMoveDetected} />
                  <RightPanel puzzle={puzzle} />
              </>
          )}
      </div>
  );
}
