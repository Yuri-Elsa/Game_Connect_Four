/**
 * components/GameBoard.jsx
 * Renders the Connect Four grid, the column-click buttons above it,
 * hover preview, drop animation, and win-cell highlighting.
 *
 * Props:
 *   board          number[][]   Current board state (0 = empty, 1 = human, 2 = AI)
 *   currentPlayer  number       Whose turn it is (1 or 2)
 *   winCells       [r,c][]|null Winning cell coordinates to highlight
 *   droppingCell   {row,col}|null Cell currently being animated
 *   aiThinking     boolean      Disables interaction while AI calculates
 *   gameOver       boolean
 *   tutorialHighlightCol number|undefined  Column to glow in tutorial
 *   onColClick     (col: number) => void
 */

import { useState } from "react";
import { ROWS, COLS, PLAYER_HUMAN } from "../constants/board.js";

export function GameBoard({
  board,
  currentPlayer,
  winCells,
  droppingCell,
  aiThinking,
  gameOver,
  tutorialHighlightCol,
  onColClick,
}) {
  const [hoverCol, setHoverCol] = useState(null);

  // Find the landing row for hover preview
  const landingRow = (col) => {
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === 0) return r;
    }
    return null;
  };

  const isWinCell = (r, c) =>
    winCells?.some(([wr, wc]) => wr === r && wc === c);
  const isDropping = (r, c) =>
    droppingCell?.row === r && droppingCell?.col === c;
  const isHoverPreview = (r, c) => {
    if (
      hoverCol !== c ||
      currentPlayer !== PLAYER_HUMAN ||
      gameOver ||
      aiThinking
    )
      return false;
    return landingRow(c) === r;
  };

  const canInteract =
    currentPlayer === PLAYER_HUMAN && !gameOver && !aiThinking;

  return (
    <div className="board-wrapper">
      {/* Column drop buttons */}
      <div className="col-buttons">
        {Array.from({ length: COLS }, (_, c) => (
          <button
            key={c}
            className={`col-btn ${tutorialHighlightCol === c ? "highlighted" : ""}`}
            onClick={() => onColClick(c)}
            disabled={board[0][c] !== 0 || !canInteract}
            onMouseEnter={() => setHoverCol(c)}
            onMouseLeave={() => setHoverCol(null)}
          />
        ))}
      </div>

      {/* Board grid */}
      <div className="board-grid">
        {Array.from({ length: ROWS }, (_, r) =>
          Array.from({ length: COLS }, (_, c) => {
            const player = board[r][c];
            const winning = isWinCell(r, c);
            const dropping = isDropping(r, c);
            const preview = isHoverPreview(r, c);

            return (
              <div
                key={`${r}-${c}`}
                className={`cell ${hoverCol === c && canInteract ? "hover-preview" : ""}`}
                onClick={() => onColClick(c)}
                onMouseEnter={() => setHoverCol(c)}
                onMouseLeave={() => setHoverCol(null)}
                style={{ cursor: canInteract ? "pointer" : "default" }}
              >
                {player !== 0 && (
                  <div
                    className={[
                      "disc",
                      player === 1 ? "player1" : "player2",
                      winning ? "winning" : "",
                      dropping ? "dropping" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                )}
                {player === 0 && preview && (
                  <div className="disc player1 preview" />
                )}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
