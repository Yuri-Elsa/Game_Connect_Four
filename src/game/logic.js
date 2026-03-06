/**
 * game/logic.js
 * Pure functions for Connect Four board state.
 * No React, no side-effects — easy to unit-test.
 */

import { ROWS, COLS } from "../constants/board.js";

/** Return a fresh empty board (6×7 zeros). */
export const emptyBoard = () =>
  Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(0));

/**
 * Drop a player's piece into `col`.
 * @returns {{ board: number[][], row: number } | null}  null if column is full.
 */
export function dropPiece(board, col, player) {
  const b = board.map((r) => [...r]);
  for (let r = ROWS - 1; r >= 0; r--) {
    if (b[r][col] === 0) {
      b[r][col] = player;
      return { board: b, row: r };
    }
  }
  return null; // column full
}

/**
 * Check whether `player` has four in a row.
 * @returns {[number,number][] | null} winning cell coordinates, or null.
 */
export function checkWinner(board, player) {
  // Horizontal
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS - 3; c++)
      if ([0, 1, 2, 3].every((i) => board[r][c + i] === player))
        return [
          [r, c],
          [r, c + 1],
          [r, c + 2],
          [r, c + 3],
        ];

  // Vertical
  for (let c = 0; c < COLS; c++)
    for (let r = 0; r < ROWS - 3; r++)
      if ([0, 1, 2, 3].every((i) => board[r + i][c] === player))
        return [
          [r, c],
          [r + 1, c],
          [r + 2, c],
          [r + 3, c],
        ];

  // Diagonal ↘
  for (let r = 0; r < ROWS - 3; r++)
    for (let c = 0; c < COLS - 3; c++)
      if ([0, 1, 2, 3].every((i) => board[r + i][c + i] === player))
        return [
          [r, c],
          [r + 1, c + 1],
          [r + 2, c + 2],
          [r + 3, c + 3],
        ];

  // Diagonal ↙
  for (let r = 3; r < ROWS; r++)
    for (let c = 0; c < COLS - 3; c++)
      if ([0, 1, 2, 3].every((i) => board[r - i][c + i] === player))
        return [
          [r, c],
          [r - 1, c + 1],
          [r - 2, c + 2],
          [r - 3, c + 3],
        ];

  return null;
}

/** True when every top-row cell is occupied. */
export const isFull = (board) => board[0].every((c) => c !== 0);

/** All column indices that still have an empty slot. */
export const getValidCols = (board) =>
  Array.from({ length: COLS }, (_, i) => i).filter((c) => board[0][c] === 0);
