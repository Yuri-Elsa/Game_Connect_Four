/**
 * ai/alphaBeta.js
 * Minimax search with Alpha-Beta Pruning.
 *
 * Move ordering (centre-first) is applied at every level to maximise pruning.
 * An optional wall-clock time guard aborts deep branches when the budget runs out.
 */

import { COLS } from "../constants/board.js";
import { dropPiece, checkWinner, isFull, getValidCols } from "../game/logic.js";
import { evaluatePosition } from "./evaluation.js";

/**
 * Recursive Alpha-Beta search.
 *
 * @param {number[][]} board   Current board state.
 * @param {number}     depth   Remaining search depth.
 * @param {number}     alpha   Best score the maximiser can guarantee.
 * @param {number}     beta    Best score the minimiser can guarantee.
 * @param {boolean}    isMax   True → maximising player's turn.
 * @param {number}     player  The AI's player number (1 or 2).
 * @param {number}     startMs Wall-clock start time (Date.now()).
 * @param {number}     limitMs Time budget in milliseconds.
 * @returns {number} Heuristic score of the position.
 */
export function alphaBeta(
  board,
  depth,
  alpha,
  beta,
  isMax,
  player,
  startMs,
  limitMs,
) {
  // Time guard — bail early to stay within budget
  if (Date.now() - startMs > limitMs) return evaluatePosition(board, player);

  const opp = 3 - player;

  // Terminal checks
  if (checkWinner(board, player)) return 1_000_000;
  if (checkWinner(board, opp)) return -1_000_000;

  const validCols = getValidCols(board);

  if (isFull(board) || depth === 0)
    return evaluatePosition(board, validCols.length === 0 ? opp : player);

  // Centre-first move ordering for maximum pruning
  const center = Math.floor(COLS / 2);
  validCols.sort((a, b) => Math.abs(a - center) - Math.abs(b - center));

  if (isMax) {
    let value = -Infinity;
    for (const col of validCols) {
      const res = dropPiece(board, col, player);
      if (!res) continue;
      value = Math.max(
        value,
        alphaBeta(
          res.board,
          depth - 1,
          alpha,
          beta,
          false,
          player,
          startMs,
          limitMs,
        ),
      );
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break; // β cut-off
    }
    return value;
  } else {
    let value = Infinity;
    for (const col of validCols) {
      const res = dropPiece(board, col, opp);
      if (!res) continue;
      value = Math.min(
        value,
        alphaBeta(
          res.board,
          depth - 1,
          alpha,
          beta,
          true,
          player,
          startMs,
          limitMs,
        ),
      );
      beta = Math.min(beta, value);
      if (alpha >= beta) break; // α cut-off
    }
    return value;
  }
}

/**
 * Entry point: find the best column for `player` given the current `board`.
 *
 * @param {number[][]} board
 * @param {number}     player      AI player number.
 * @param {number}     depth       Search depth.
 * @param {number}     timeLimitSec  Wall-clock budget in **seconds**.
 * @returns {{ col: number, timeMs: number, nodes: number }}
 */
export function getBestMove(board, player, depth, timeLimitSec) {
  const startMs = Date.now();
  const limitMs = timeLimitSec * 1000;
  const center = Math.floor(COLS / 2);

  const validCols = getValidCols(board);
  validCols.sort((a, b) => Math.abs(a - center) - Math.abs(b - center));

  let bestScore = -Infinity;
  let bestCol = validCols[0];
  let nodes = 0;

  for (const col of validCols) {
    const res = dropPiece(board, col, player);
    if (!res) continue;
    nodes++;
    const score = alphaBeta(
      res.board,
      depth - 1,
      -Infinity,
      Infinity,
      false,
      player,
      startMs,
      limitMs,
    );
    if (score > bestScore) {
      bestScore = score;
      bestCol = col;
    }
  }

  return { col: bestCol, timeMs: Date.now() - startMs, nodes };
}
