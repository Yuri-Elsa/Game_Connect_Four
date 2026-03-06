/**
 * ai/alphaBeta.js
 * Minimax search with Alpha-Beta Pruning.
 */

import { COLS } from "../constants/board.js";
import { dropPiece, checkWinner, isFull, getValidCols } from "../game/logic.js";
import { evaluatePosition } from "./evaluation.js";

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
  if (Date.now() - startMs > limitMs) return evaluatePosition(board, player);

  const opp = 3 - player;

  if (checkWinner(board, player)) return 1_000_000;
  if (checkWinner(board, opp)) return -1_000_000;

  const validCols = getValidCols(board);

  if (isFull(board) || depth === 0)
    return evaluatePosition(board, validCols.length === 0 ? opp : player);

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
      if (alpha >= beta) break;
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
      if (alpha >= beta) break;
    }
    return value;
  }
}

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
