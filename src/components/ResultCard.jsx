/**
 * components/ResultCard.jsx
 * Full-screen overlay shown when a game ends (win / lose / draw).
 *
 * Props:
 *   winner    number  0 = draw, 1 = human win, 2 = AI win
 *   onRestart () => void
 */

const RESULT_CONFIG = {
  1: {
    emoji: "🎉",
    title: "Kamu Menang!",
    sub: "Luar biasa! Kamu berhasil mengalahkan AI.",
    color: "#ff4e6a",
  },
  2: {
    emoji: "🤖",
    title: "AI Menang!",
    sub: "AI terlalu tangguh kali ini. Coba lagi!",
    color: "#ffb347",
  },
  0: {
    emoji: "🤝",
    title: "Seri!",
    sub: "Papan penuh. Permainan yang sengit!",
    color: "#06d6a0",
  },
};

export function ResultCard({ winner, onRestart }) {
  const cfg = RESULT_CONFIG[winner] ?? RESULT_CONFIG[0];

  return (
    <div className="result-banner">
      <div className="result-card">
        <span className="result-emoji">{cfg.emoji}</span>
        <div className="result-title" style={{ color: cfg.color }}>
          {cfg.title}
        </div>
        <div className="result-sub">{cfg.sub}</div>
        <button className="btn btn-primary" onClick={onRestart}>
          🔄 Main Lagi
        </button>
      </div>
    </div>
  );
}
