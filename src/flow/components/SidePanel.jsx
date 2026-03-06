/**
 * components/SidePanel.jsx
 * Right-hand panel containing:
 *   - Game status / AI thinking indicator
 *   - Live AI metrics (nodes, time, depth)
 *   - Depth setting
 *   - Action buttons (New Game, Undo, Tutorial)
 *   - Move history list
 *
 * Props: see PropTypes-style comment below.
 */

import { PLAYER_HUMAN, PLAYER_AI } from "../constants/board.js";

export function SidePanel({
  currentPlayer, // number
  winner, // number | null
  gameOver, // boolean
  aiThinking, // boolean
  metrics, // { nodes, timeMs, depth }
  depth, // number
  setDepth, // (n: number) => void
  moveHistory, // { player, col, row }[]
  boardHistoryLen, // number  — used to enable/disable Undo
  tutorialHighlightMetrics, // boolean — glow when tutorial focuses here
  onRestart, // () => void
  onUndo, // () => void
  onTutorial, // () => void
}) {
  const statusText = () => {
    if (gameOver) {
      if (winner === 0) return "Seri!";
      if (winner === PLAYER_HUMAN) return "Kamu Menang!";
      return "AI Menang!";
    }
    return currentPlayer === PLAYER_HUMAN ? "Giliranmu!" : "Giliran AI";
  };

  return (
    <div className="panel">
      {/* ── Status ─────────────────────────────────────────────────────── */}
      <div className="panel-card">
        <h3>Status Permainan</h3>
        {aiThinking ? (
          <div className="ai-thinking">
            <div className="status-dot ai" />
            <span>AI berpikir</span>
            <div className="thinking-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
        ) : (
          <div className="status-label">
            <div
              className={`status-dot ${
                gameOver
                  ? "none"
                  : currentPlayer === PLAYER_HUMAN
                    ? "human"
                    : "ai"
              }`}
            />
            <span>{statusText()}</span>
          </div>
        )}
      </div>

      {/* ── AI Metrics ─────────────────────────────────────────────────── */}
      <div
        className={`panel-card ${tutorialHighlightMetrics ? "highlighted-metrics" : ""}`}
      >
        <h3>Metrik AI</h3>
        <div className="metric-row">
          <span className="metric-label">Algoritma</span>
          <span className="metric-value">Alpha-Beta</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">Nodes Diperiksa</span>
          <span className="metric-value">{metrics.nodes.toLocaleString()}</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">Waktu Kalkulasi</span>
          <span className="metric-value">{metrics.timeMs.toFixed(0)} ms</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">Depth</span>
          <span className="metric-value">{metrics.depth}</span>
        </div>
      </div>

      {/* ── Depth Setting ──────────────────────────────────────────────── */}
      <div className="panel-card">
        <h3>Pengaturan AI</h3>
        <div className="setting-row">
          <span className="setting-label">Kedalaman (Depth)</span>
          <div className="depth-ctrl">
            <button
              className="depth-btn"
              onClick={() => setDepth((d) => Math.max(1, d - 1))}
            >
              −
            </button>
            <span className="depth-val">{depth}</span>
            <button
              className="depth-btn"
              onClick={() => setDepth((d) => Math.min(7, d + 1))}
            >
              +
            </button>
          </div>
        </div>
        <div
          style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}
        >
          Depth lebih tinggi = AI lebih kuat &amp; lambat
        </div>
      </div>

      {/* ── Actions ────────────────────────────────────────────────────── */}
      <div
        className="panel-card"
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      >
        <button className="btn btn-primary" onClick={onRestart}>
          🔄 New Game
        </button>
        <button
          className="btn btn-secondary"
          onClick={onUndo}
          disabled={boardHistoryLen < 2}
        >
          ↩️ Undo
        </button>
        <button className="btn btn-secondary" onClick={onTutorial}>
          🎓 Tutorial
        </button>
      </div>

      {/* ── Move History ───────────────────────────────────────────────── */}
      <div className="panel-card">
        <h3>Riwayat Gerakan</h3>
        <div className="move-history">
          {moveHistory.length === 0 && (
            <div className="move-item">Belum ada gerakan</div>
          )}
          {[...moveHistory]
            .reverse()
            .slice(0, 10)
            .map((m, i) => (
              <div
                key={i}
                className={`move-item ${
                  m.player === PLAYER_HUMAN ? "human-move" : "ai-move"
                }`}
              >
                {m.player === PLAYER_HUMAN ? "🔴" : "🟡"} Kolom {m.col + 1}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
