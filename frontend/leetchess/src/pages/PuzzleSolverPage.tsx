// PuzzleSolverPage.tsx
import { useEffect, useRef, useState } from "react";
import ChessBoard from "../components/ChessBoard";
import type { onDropParams } from "../components/ChessBoard";
import './PuzzleSolverPage.css';
import { useParams } from "react-router-dom";

// --- Types ---
interface Attempt {
  id: number;
  time: string;
  solved: boolean;
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
    onMoveDetected: (params: onDropParams) => boolean;
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
              data-solved={attempt.solved}
            >
              <div className="attempt-thumb"></div>
              <div className="attempt-info">
                <div className="attempt-id">#{attempt.id}</div>
                <div className="attempt-time">{attempt.time}</div>
              </div>
              <div className={`attempt-status ${attempt.solved ? "solved" : "unsolved"}`}>
                {currentAttempt === attempt.id ? "Current" : attempt.solved ? "Solved" : "Unsolved"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Board Component ---
function Board({ moveHistory, botMove, initialFen, playerAlliance, onMoveDetected }: BoardProps) {


  return (
    <div className="board-container">
      <div className="board-wrapper">
        <div className="chessboard" id="board1">
            <ChessBoard fen={initialFen} botMove={botMove} playerAlliance={playerAlliance} onPlayerMove={onMoveDetected}/>
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
    return (
        <div className="right-panel">
            <div className="puzzle-info">
                <div className="puzzle-header">
                    <div>
                        <div className="puzzle-number">Puzzle #{puzzle.id}</div>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.5rem" }}>
                        <svg width="16" height="16" fill="none">
                            <circle cx="8" cy="8" r={8} fill="currentColor" opacity={0.2} />
                            <circle cx="8" cy="8" r={3} fill="currentColor" />
                        </svg>
                        {/* <span className="difficulty-badge">{puzzle.difficulty}</span> */}
                        </div>
                    </div>
                </div>

                <div className="puzzle-stats">
                    <div className="stat">
                        <div className="stat-label">Rating</div>
                        <div className="stat-value">{puzzle.rating}</div>
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

// --- Main Page ---
export default function PuzzleSolverPage() {
    const [currentAttempt, setCurrentAttempt] = useState<number>(89231);
    const [puzzle, setPuzzle] = useState<Puzzle>();
    
    const attempts: Attempt[] = [
        { id: 89231, time: "In Progress", solved: false },
        { id: 89201, time: "2m 30s", solved: true },
    ];

    const moveHistory: string[] = ["Nf3 - Nf6"];


    const params = useParams<{ puzzleId: string }>(); // get URL params
    const puzzleId = params.puzzleId; // string value of "1" from /puzzles/1/solve

    useEffect(() => {
        console.log("PuzzleSolverPage mounted with puzzleId:", puzzleId);
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

    function onMoveDetected(params: onDropParams) {
        console.log("Player move detected:", params.source, params.target);
        // sent mmove to backend for validation and response

        return true;
    }

    return (
        <div className="solver-container">
            <Sidebar attempts={attempts} currentAttempt={currentAttempt} setCurrentAttempt={setCurrentAttempt} />
            {puzzle && (
                <>
                    <Board
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
