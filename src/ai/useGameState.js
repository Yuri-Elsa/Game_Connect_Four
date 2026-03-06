/**
 * hooks/useGameState.js
 * Central game-state hook.
 *
 * Owns: board, current player, win detection, move history,
 *       undo stack, AI trigger, tutorial gating, and phase management.
 *
 * Components stay thin — they only call actions exposed by this hook.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  ROWS,
  COLS,
  PLAYER_HUMAN,
  PLAYER_AI,
  DRAW,
  DEFAULT_DEPTH,
  AI_TIME_LIMIT_SEC,
  AI_MOVE_DELAY_MS,
  PHASE_ONBOARDING,
  PHASE_TUTORIAL,
  PHASE_PLAYING,
} from "../constants/board.js";
import { TUTORIAL_STEPS } from "../constants/tutorialSteps.js";
import { emptyBoard, dropPiece, checkWinner, isFull } from "../game/logic.js";
import { getBestMove } from "../ai/alphaBeta.js";

export function useGameState() {
  // ── Board & game status ──────────────────────────────────────────────────────
  const [board, setBoard] = useState(emptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_HUMAN);
  const [winner, setWinner] = useState(null); // null | 0 | 1 | 2
  const [winCells, setWinCells] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // ── Animation helpers ────────────────────────────────────────────────────────
  const [droppingCell, setDroppingCell] = useState(null); // { row, col }
  const [aiThinking, setAiThinking] = useState(false);

  // ── AI metrics ───────────────────────────────────────────────────────────────
  const [metrics, setMetrics] = useState({
    nodes: 0,
    timeMs: 0,
    depth: DEFAULT_DEPTH,
  });
  const [depth, setDepth] = useState(DEFAULT_DEPTH);

  // ── History & undo ───────────────────────────────────────────────────────────
  const [moveHistory, setMoveHistory] = useState([]);
  const [boardHistory, setBoardHistory] = useState([]);

  // ── Phase & tutorial ─────────────────────────────────────────────────────────
  const [phase, setPhase] = useState(PHASE_ONBOARDING);
  const [tutorialStep, setTutorialStep] = useState(0);

  const aiRef = useRef(false); // prevent double AI calls

  // ── Internal: commit a terminal state ───────────────────────────────────────
  const finishGame = useCallback((w) => {
    setWinner(w);
    setGameOver(true);
    setShowResult(true);
  }, []);

  // ── Core move action ─────────────────────────────────────────────────────────
  /**
   * Drop a piece in `col` for `player`.
   * Returns true on success, false if the move is invalid.
   */
  const makeMove = useCallback(
    (col, playerOverride) => {
      const player = playerOverride ?? currentPlayer;
      if (gameOver) return false;
      if (board[0][col] !== 0) return false;

      const result = dropPiece(board, col, player);
      if (!result) return false;

      const { board: newBoard, row } = result;

      // Trigger drop animation
      setDroppingCell({ row, col });
      setTimeout(() => setDroppingCell(null), 350);

      setBoard(newBoard);
      setBoardHistory((prev) => [...prev, board]);
      setMoveHistory((prev) => [...prev, { player, col, row }]);

      // Check win / draw
      const winResult = checkWinner(newBoard, player);
      if (winResult) {
        setWinCells(winResult);
        finishGame(player);
        return true;
      }
      if (isFull(newBoard)) {
        finishGame(DRAW);
        return true;
      }

      setCurrentPlayer(3 - player);
      return true;
    },
    [board, currentPlayer, gameOver, finishGame],
  );

  // ── AI trigger ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (currentPlayer !== PLAYER_AI) return;
    if (gameOver) return;
    if (phase === PHASE_ONBOARDING) return;
    // In tutorial, only fire AI after step 1 (player's first move)
    if (phase === PHASE_TUTORIAL && tutorialStep < 2) return;
    if (aiRef.current) return;

    aiRef.current = true;
    setAiThinking(true);

    const timer = setTimeout(() => {
      const { col, timeMs, nodes } = getBestMove(
        board,
        PLAYER_AI,
        depth,
        AI_TIME_LIMIT_SEC,
      );
      setMetrics({ nodes, timeMs, depth });
      makeMove(col, PLAYER_AI);
      setAiThinking(false);
      aiRef.current = false;

      // Advance tutorial after AI has moved
      if (phase === PHASE_TUTORIAL && tutorialStep === 1) {
        setTutorialStep(2);
      }
    }, AI_MOVE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [currentPlayer, board, gameOver, depth, makeMove, phase, tutorialStep]);

  // ── Human column click ───────────────────────────────────────────────────────
  const handleColClick = useCallback(
    (col) => {
      if (gameOver || currentPlayer !== PLAYER_HUMAN || aiThinking) return;

      if (phase === PHASE_TUTORIAL) {
        const step = TUTORIAL_STEPS[tutorialStep];
        // Enforce the scripted column in tutorial
        if (step?.forceCol !== undefined && col !== step.forceCol) return;

        const success = makeMove(col, PLAYER_HUMAN);
        if (!success) return;

        // Advance tutorial step after human's click
        if (step?.action === "click_col") {
          const isLastClickStep = tutorialStep === 5; // winning move
          setTutorialStep((prev) => (isLastClickStep ? 6 : prev + 1));
        }
      } else {
        makeMove(col, PLAYER_HUMAN);
      }
    },
    [gameOver, currentPlayer, aiThinking, phase, tutorialStep, makeMove],
  );

  // ── Undo ─────────────────────────────────────────────────────────────────────
  const handleUndo = useCallback(() => {
    // Undo two half-moves: the AI's response and the human's move
    if (boardHistory.length < 2) return;

    const prevBoard = boardHistory[boardHistory.length - 2];
    setBoardHistory((h) => h.slice(0, -2));
    setMoveHistory((h) => h.slice(0, -2));
    setBoard(prevBoard);
    setCurrentPlayer(PLAYER_HUMAN);
    setGameOver(false);
    setWinner(null);
    setWinCells(null);
    setShowResult(false);
    aiRef.current = false;
  }, [boardHistory]);

  // ── New game / restart ────────────────────────────────────────────────────────
  const handleRestart = useCallback(() => {
    setBoard(emptyBoard());
    setCurrentPlayer(PLAYER_HUMAN);
    setWinner(null);
    setWinCells(null);
    setGameOver(false);
    setShowResult(false);
    setMoveHistory([]);
    setBoardHistory([]);
    setDroppingCell(null);
    aiRef.current = false;
  }, []);

  // ── Start tutorial ────────────────────────────────────────────────────────────
  const startTutorial = useCallback(() => {
    handleRestart();
    setPhase(PHASE_TUTORIAL);
    setTutorialStep(0);
  }, [handleRestart]);

  // ── Skip tutorial → free play ─────────────────────────────────────────────────
  const skipTutorial = useCallback(() => {
    handleRestart();
    setPhase(PHASE_PLAYING);
  }, [handleRestart]);

  // ── Finish tutorial → free play ───────────────────────────────────────────────
  const finishTutorial = useCallback(() => {
    handleRestart();
    setPhase(PHASE_PLAYING);
  }, [handleRestart]);

  return {
    // State
    board,
    currentPlayer,
    winner,
    winCells,
    gameOver,
    showResult,
    droppingCell,
    aiThinking,
    metrics,
    depth,
    setDepth,
    moveHistory,
    phase,
    tutorialStep,

    // Actions
    handleColClick,
    handleUndo,
    handleRestart,
    startTutorial,
    skipTutorial,
    finishTutorial,
    setPhase,
  };
}
