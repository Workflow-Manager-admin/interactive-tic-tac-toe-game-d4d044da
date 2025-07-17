import React, { useState, useEffect } from "react";
import "./App.css";

/*
PUBLIC_INTERFACE
Main App component for Interactive Tic Tac Toe Game.
Features:
- 3x3 interactive board
- Player turns (X/O), win/draw detection
- Score tracking for the session
- Reset functionality
- Responsive, minimalistic, modern styling and centered layout
*/

const COLORS = {
  primary: "#1976d2",
  accent: "#ff9800",
  secondary: "#ffffff",
};

const WIN_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // columns
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

// Helpers
function calculateWinner(squares) {
  for (let combo of WIN_COMBOS) {
    const [a, b, c] = combo;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

function isDraw(squares) {
  return squares.every((sq) => sq) && !calculateWinner(squares);
}

// Game Board Cell Component
function Square({ value, onClick, highlight }) {
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      style={{
        color: value === "X" ? COLORS.primary : COLORS.accent,
        background: highlight
          ? "rgba(255, 152, 0, 0.12)"
          : COLORS.secondary,
        borderColor: "var(--border-color)",
      }}
      aria-label={value ? value : "Empty square"}
    >
      {value}
    </button>
  );
}

/*
PUBLIC_INTERFACE
Main Game Board for Tic Tac Toe (stateless).
Props:
  - squares: array[9] ('X', 'O', or null)
  - onSquareClick: fn(index)
  - winLine: array of winning indices or null
*/
function Board({ squares, onSquareClick, winLine }) {
  return (
    <div className="ttt-board">
      {squares.map((value, idx) => (
        <Square
          key={idx}
          value={value}
          onClick={() => onSquareClick(idx)}
          highlight={winLine && winLine.includes(idx)}
        />
      ))}
    </div>
  );
}

function getWinnerLine(squares) {
  for (let combo of WIN_COMBOS) {
    const [a, b, c] = combo;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return combo;
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [status, setStatus] = useState("Next player: X");
  const [winLine, setWinLine] = useState(null);

  // Update status whenever board changes
  useEffect(() => {
    const winner = calculateWinner(squares);
    const wLine = getWinnerLine(squares);
    setWinLine(wLine);
    if (winner) {
      setStatus(`Winner: ${winner}`);
    } else if (isDraw(squares)) {
      setStatus("Draw!");
    } else {
      setStatus(`Next player: ${xIsNext ? "X" : "O"}`);
    }
  }, [squares, xIsNext]);

  // Update scores upon win
  useEffect(() => {
    const winner = calculateWinner(squares);
    if (winner) {
      setScores((prev) => ({
        ...prev,
        [winner]: prev[winner] + 1,
      }));
    }
  }, [squares]);

  // Handle move
  const handleSquareClick = (idx) => {
    if (squares[idx] || calculateWinner(squares)) return; // Ignore if occupied or game over
    const nextSquares = squares.slice();
    nextSquares[idx] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  // Reset only board
  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext((prev) => !prev); // Alternate starting player for fairness
    setWinLine(null);
  };

  // Reset everything including scores
  const handleResetAll = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setScores({ X: 0, O: 0 });
    setWinLine(null);
  };

  // Responsive: minimal controls, centered, flexbox
  return (
    <div className="App" style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: COLORS.secondary,
      color: COLORS.primary,
      justifyContent: "center",
      alignItems: "center"
    }}>
      <main className="ttt-container">
        <h1 className="ttt-title" style={{color: COLORS.primary, marginBottom:8, fontWeight:700, letterSpacing:2}}>Tic Tac Toe</h1>
        <section className="ttt-scoreboard" aria-label="Scoreboard">
          <span className="ttt-score ttt-score-x">
            <strong style={{color: COLORS.primary}}>X</strong> &nbsp;
            <span className="ttt-score-num">{scores.X}</span>
          </span>
          <span className="ttt-score ttt-score-o">
            <strong style={{color: COLORS.accent}}>O</strong> &nbsp;
            <span className="ttt-score-num">{scores.O}</span>
          </span>
        </section>
        <section className="ttt-status" style={{
          margin: "1rem 0",
          minHeight: "2.5rem",
          fontWeight: 500,
          letterSpacing: ".5px"
        }}>
          {status}
        </section>
        <Board squares={squares} onSquareClick={handleSquareClick} winLine={winLine} />
        <section className="ttt-controls" style={{
          marginTop: 16, 
          display: "flex",
          gap: 16,
          justifyContent: "center"
        }}>
          <button className="ttt-btn" onClick={handleReset} aria-label="New Game">
            New Game
          </button>
          <button className="ttt-btn ttt-btn-outline" onClick={handleResetAll} aria-label="Reset Scores">
            Reset Scores
          </button>
        </section>
        <footer className="ttt-footer" style={{
          marginTop: "2.5rem",
          fontSize: "1rem",
          color: "#aaa"
        }}>
          <span>
            Minimal Tic Tac Toe &copy; {new Date().getFullYear()}
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;
