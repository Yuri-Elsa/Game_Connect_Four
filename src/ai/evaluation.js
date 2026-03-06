/**
 * ai/evaluation.js
 * Heuristic scoring functions used by the Alpha-Beta search.
 * Kept separate so scoring weights are easy to tune independently.
 */

import { ROWS, COLS } from "../constants/board.js";

/**
 * Score a 4-cell window for `player`.
 * Rewards pieces in a row; penalises opponent threats.
 */
export function evaluateWindow(window, player) {
  const opp = 3 - player;
  const pc = window.filter((x) => x === player).length;
  const oc = window.filter((x) => x === opp).length;
  const ec = window.filter((x) => x === 0).length;

  let score = 0;
  if (pc === 4) score += 100_000;
  else if (pc === 3 && ec === 1) score += 100;
  else if (pc === 2 && ec === 2) score += 10;

  if (oc === 3 && ec === 1)
    score -= 120; // block is slightly more urgent
  else if (oc === 2 && ec === 2) score -= 12;

  return score;
}

/**
 * Full board heuristic for `player`.
 * Scans all horizontal, vertical, and diagonal windows plus centre control.
 */
export function evaluatePosition(board, player) {
  let score = 0;
  const center = Math.floor(COLS / 2);

  // Centre column bonus
  const centerCol = board.map((r) => r[center]);
  score += centerCol.filter((x) => x === player).length * 6;
  score -= centerCol.filter((x) => x === 3 - player).length * 6;

  // Horizontal windows
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS - 3; c++)
      score += evaluateWindow(
        [board[r][c], board[r][c + 1], board[r][c + 2], board[r][c + 3]],
        player,
      );

  // Vertical windows
  for (let c = 0; c < COLS; c++)
    for (let r = 0; r < ROWS - 3; r++)
      score += evaluateWindow(
        [board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c]],
        player,
      );

  // Diagonal ↘
  for (let r = 0; r < ROWS - 3; r++)
    for (let c = 0; c < COLS - 3; c++)
      score += evaluateWindow(
        [
          board[r][c],
          board[r + 1][c + 1],
          board[r + 2][c + 2],
          board[r + 3][c + 3],
        ],
        player,
      );

  // Diagonal ↙
  for (let r = 3; r < ROWS; r++)
    for (let c = 0; c < COLS - 3; c++)
      score += evaluateWindow(
        [
          board[r][c],
          board[r - 1][c + 1],
          board[r - 2][c + 2],
          board[r - 3][c + 3],
        ],
        player,
      );

  return score;
}
