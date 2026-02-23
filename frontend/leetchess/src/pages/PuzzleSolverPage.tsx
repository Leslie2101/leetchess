// PuzzleSolverPage.tsx
import { useEffect, useState } from "react";
import ChessBoard from "../components/ChessBoard";
import type { PlayerMoveFeedback } from "../components/ChessBoard";
import './PuzzleSolverPage.css';
import { useParams } from "react-router-dom";
import Chat from "../components/Chat";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// errors, time completion, 


// --- Types ---
interface Attempt {
  id: number;
  status: "solved" | "attempted" | "in_progress";
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
}

interface BoardProps {
    initialFen: string;
    moveHistory: string[];
    correctMoves: string[];
    playerAlliance: string;
    playerMoveFeedback?: PlayerMoveFeedback;
    onMoveDetected: (move: string) => void;
}

interface RightPanelProps {
  puzzle: Puzzle;
  sendUserMessage: (message: string) => void;
  aiReply: string;
}

function formatDateTime(isoString: string) {
  return new Date(isoString).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}



// --- Sidebar Component ---
function Sidebar({ attempts, currentAttempt }: SidebarProps) {

  console.log(attempts);
  function Attempts(){
    return (
      <div id="attemptsList">
        {attempts.map((attempt) => (
          <div
            key={attempt.id}
            className={`attempt-item ${currentAttempt === attempt.id ? "active" : ""}`}
            data-id={attempt.id}
            data-solved={attempt.status === "solved"}
          >
            <div className="attempt-thumb"></div>
            <div className="attempt-info">
              {/* <div className="attempt-id">#{attempt.id}</div> */}
              <div className="attempt-time">{formatDateTime(attempt.submittedTime)}</div>
            </div>
            <div className={`attempt-status ${attempt.status.toLowerCase()}`}>
              {currentAttempt === attempt.id ? "Current" : attempt.status}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <div className="section-title">Previous Attempts</div>
        <Attempts />
      
      </div>
    </div>
  );
}

// --- Board Component ---
function Board({ correctMoves, moveHistory, initialFen, playerAlliance, playerMoveFeedback, onMoveDetected }: BoardProps) {


  function ProgressDots(){
    return (
      <div className="progress-dots">
      {correctMoves.map((move, index) => (
          <div key={index} className="progress-dot completed" title={`Move ${move} - Correct`}></div>
      ))}
      
      </div>
    )
  }

  return (
    <div className="board-container">
      <div className="board-wrapper">
        <div className="chessboard" id="board1">
            <ChessBoard 
            fen={initialFen} 
            moveHistory={moveHistory} 
            playerAlliance={playerAlliance} 
            playerMoveFeedback={playerMoveFeedback} 
            onPlayerMove={onMoveDetected}/>
        </div>
      </div>

      <div className="board-footer">
        <div className="move-progress">
          <ProgressDots />
        </div>
        
      </div>
    </div>
  );
}

// --- Right Panel Component ---
function RightPanel({ puzzle, sendUserMessage, aiReply }: RightPanelProps) {

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

          <Chat 
            sendUserMessage={sendUserMessage}
            aiReply={aiReply}
          />

      </div>
  );
}


interface AttemptResponse {
  id: string;
  attemptId: number;
  botMove: string,
  isCorrect: boolean;
  isSolved: boolean;
  msg: string;
}

interface AIResponse {
  answer: string;
}


// --- Main Page ---
export default function PuzzleSolverPage() {
  const [currentAttempt, setCurrentAttempt] = useState<number>(-1);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [puzzle, setPuzzle] = useState<Puzzle>();
  const [playerMoveFeedback, setPlayerMoveFeedback] = useState<PlayerMoveFeedback | undefined>();
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [aiReply, setAIReply] = useState<string>("");
  const [playerMove, setPlayerMove] = useState<string>();


  const [correctMoves, setCorrectMoves] = useState<string[]>([]);
  const params = useParams<{ puzzleId: string }>(); // get URL params
  const puzzleId = params.puzzleId; // string value of "1" from /puzzles/1/solve

  useEffect(() => {
      if (!puzzleId) return;

      async function loadPuzzle() {
          try {
              const res = await fetch(`${API_BASE}/puzzles/${puzzleId}`);
              const json = await res.json();
              setPuzzle(json);
          } catch (err) {
              console.error(err);
          }
      }

      loadPuzzle();

      axios.get(`${API_BASE}/puzzles/${puzzleId}/attempts`, {withCredentials: true})
        .then(response => {
          setAttempts(response.data.content);
        })
        .catch(() => {
          setAttempts([]);
        });


  }, []);



  // send move to backend when playerMove state updates, which happens when a move is detected on the chessboard
  useEffect(() => {
    if (!playerMove) return;
    if (isSolved) return;

    
    sendMoveToApi(playerMove);
    setPlayerMove(undefined); // reset playerMove state after sending to API
  }, [playerMove]);

  
  async function sendAIQuestion(question: string){

    const res = await fetch(`${API_BASE}/puzzles/${puzzleId}/attempts/${currentAttempt}/ai-questions`,
        {
          method: "POST",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ question })
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json: AIResponse = await res.json();

      setAIReply(json.answer);


  }



  async function sendMoveToApi(move: string) {
    // first move being made 

    let url = `${API_BASE}/puzzles/${puzzleId}/attempts`;

    if (currentAttempt != -1){
      url = `${API_BASE}/puzzles/${puzzleId}/attempts/${currentAttempt}/moves`;
    }

    const res = await fetch(url,
      {
        method: "POST",
        credentials: 'include',
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
    console.log("Received response for the move:", json);
    setCurrentAttempt(json.attemptId);
    setIsSolved(json.isSolved);
    setPlayerMoveFeedback({
      feedbackId: json.id,
      playerMove: move,
      isCorrect: json.isCorrect,
      isFinalMove: json.isSolved,
      botResponseMove: json.botMove
    });

    if (json.isSolved){
      alert("Puzzle Solved!");
    }

    if (json.isCorrect){
      setCorrectMoves([...correctMoves, move]);
    }


  }


  

  function onMoveDetected(move: string) {
    console.log("Player move detected:", move);    
    // sent move to backend for validation and response
    setPlayerMove(move);
    
  }

  return (
      <div className="solver-container">
          <Sidebar attempts={attempts} currentAttempt={currentAttempt} />
          {puzzle && (
              <>
                  {/* <PromotionModal
                    isOpen={!!pendingPromotion}
                    selectPromotion={onPromotionSelect}
                  /> */}
                  
                  <Board
                      playerMoveFeedback={playerMoveFeedback}
                      playerAlliance={puzzle.playerAlliance} 
                      correctMoves={correctMoves}
                      moveHistory={[puzzle.botMove]} 
                      initialFen={puzzle.fen} 
                      onMoveDetected={onMoveDetected} />
                  <RightPanel 
                    puzzle={puzzle}
                    sendUserMessage={sendAIQuestion} 
                    aiReply={aiReply}
                  />
              </>
          )}
      </div>
  );
}
