/**
 * styles/gameStyles.js
 * All CSS for Connect Four, exported as a single template-literal string
 * injected via a <style> tag in the root component.
 *
 * Organised into clearly labelled sections so each part is easy to find and edit.
 */

export const gameStyles = `
/* ─── Reset & Base ─────────────────────────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Righteous&family=DM+Sans:wght@400;500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: #060b18;
  font-family: 'DM Sans', sans-serif;
  overflow: hidden;
}

/* ─── App Shell ─────────────────────────────────────────────────────────────── */
.app {
  width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: radial-gradient(ellipse at 20% 50%, #0d1f4f 0%, #060b18 60%);
  position: relative;
  overflow: hidden;
}

.app::before {
  content: '';
  position: absolute; inset: 0;
  background:
    radial-gradient(circle at 80% 20%, rgba(255,80,120,0.07) 0%, transparent 40%),
    radial-gradient(circle at 10% 80%, rgba(50,120,255,0.07) 0%, transparent 40%);
  pointer-events: none;
}

/* ─── Stars Background ──────────────────────────────────────────────────────── */
.stars { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }

.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: twinkle 3s infinite alternate;
}

@keyframes twinkle {
  from { opacity: 0.1; } to { opacity: 0.6; }
}

/* ─── Game Layout ───────────────────────────────────────────────────────────── */
.game-container {
  display: flex; gap: 24px; align-items: flex-start;
  z-index: 1;
  padding: 20px;
}

.board-section {
  display: flex; flex-direction: column; align-items: center; gap: 16px;
}

/* ─── Title ─────────────────────────────────────────────────────────────────── */
.title {
  font-family: 'Righteous', cursive;
  font-size: 2.2rem;
  letter-spacing: 3px;
  background: linear-gradient(135deg, #ff4e6a, #ffb347, #ff4e6a);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s ease infinite;
}

@keyframes shimmer {
  0%   { background-position: 0%   50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0%   50%; }
}

/* ─── Board Wrapper ─────────────────────────────────────────────────────────── */
.board-wrapper {
  position: relative;
  background: linear-gradient(145deg, #0a1628, #0d1f3c);
  border-radius: 20px;
  padding: 16px;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow:
    0 30px 80px rgba(0,0,0,0.7),
    0 0 0 1px rgba(255,255,255,0.04),
    inset 0 1px 0 rgba(255,255,255,0.1);
}

/* ─── Column Buttons ────────────────────────────────────────────────────────── */
.col-buttons {
  display: flex; gap: 8px; margin-bottom: 8px;
}

.col-btn {
  width: 56px; height: 28px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.3);
  font-size: 12px;
  transition: all 0.2s;
}

.col-btn::after { content: '▼'; font-size: 10px; }

.col-btn:hover:not(:disabled) {
  border-color: rgba(255,78,106,0.6);
  background: rgba(255,78,106,0.1);
  color: rgba(255,78,106,0.9);
  transform: translateY(-2px);
}

.col-btn.highlighted {
  border-color: #06d6a0;
  background: rgba(6,214,160,0.15);
  color: #06d6a0;
  animation: pulse-green 1s ease infinite;
}

@keyframes pulse-green {
  0%,100% { box-shadow: 0 0 0 0   rgba(6,214,160,0.4); }
  50%      { box-shadow: 0 0 0 6px rgba(6,214,160,0);   }
}

.col-btn:disabled { opacity: 0.3; cursor: not-allowed; }

/* ─── Board Grid ────────────────────────────────────────────────────────────── */
.board-grid {
  display: grid;
  grid-template-columns: repeat(7, 56px);
  grid-template-rows:    repeat(6, 56px);
  gap: 8px;
}

.cell {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: #050d1e;
  border: 2px solid #0f1e38;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 4px 8px rgba(0,0,0,0.5);
  transition: border-color 0.2s;
}

.cell.hover-preview { border-color: rgba(255,78,106,0.4); }

/* ─── Discs ─────────────────────────────────────────────────────────────────── */
.disc {
  width: 100%; height: 100%;
  border-radius: 50%;
  position: absolute; top: 0; left: 0;
}

.disc.player1 {
  background: radial-gradient(circle at 35% 30%, #ff8da0, #ff4e6a 50%, #c9003a);
  box-shadow: 0 4px 12px rgba(255,78,106,0.6), inset 0 -2px 4px rgba(0,0,0,0.3);
}

.disc.player2 {
  background: radial-gradient(circle at 35% 30%, #ffe99a, #ffb347 50%, #e07b00);
  box-shadow: 0 4px 12px rgba(255,179,71,0.6), inset 0 -2px 4px rgba(0,0,0,0.3);
}

.disc.winning {
  animation: winPulse 0.6s ease infinite alternate;
}

@keyframes winPulse {
  from { box-shadow: 0 0 0 0   rgba(6,214,160,0.8), 0 4px 12px rgba(255,179,71,0.6); transform: scale(1);    }
  to   { box-shadow: 0 0 0 8px rgba(6,214,160,0.2), 0 4px 12px rgba(255,179,71,0.6); transform: scale(1.05); }
}

.disc.dropping {
  animation: dropIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes dropIn {
  from { transform: translateY(-400px); }
  to   { transform: translateY(0);       }
}

.disc.preview { opacity: 0.3; }

/* ─── Legend ────────────────────────────────────────────────────────────────── */
.legend { display: flex; gap: 16px; justify-content: center; }

.legend-item {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; color: rgba(255,255,255,0.45);
}

.legend-disc { width: 14px; height: 14px; border-radius: 50%; }
.legend-disc.p1 { background: radial-gradient(circle at 35% 30%, #ff8da0, #ff4e6a); }
.legend-disc.p2 { background: radial-gradient(circle at 35% 30%, #ffe99a, #ffb347); }

/* ─── Side Panel ────────────────────────────────────────────────────────────── */
.panel {
  width: 220px;
  display: flex; flex-direction: column; gap: 12px;
}

.panel-card {
  background: linear-gradient(145deg, #0a1628, #0c1930);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}

.panel-card h3 {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgba(255,255,255,0.35);
  margin-bottom: 10px;
  font-weight: 600;
}

/* ─── Status ────────────────────────────────────────────────────────────────── */
.status-label {
  display: flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 600; color: white;
}

.status-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.human { background: #ff4e6a; box-shadow: 0 0 8px #ff4e6a; }
.status-dot.ai    { background: #ffb347; box-shadow: 0 0 8px #ffb347; animation: aiPulse 1s ease infinite; }
.status-dot.none  { background: rgba(255,255,255,0.2); }

@keyframes aiPulse {
  0%,100% { transform: scale(1);   opacity: 1;   }
  50%     { transform: scale(1.3); opacity: 0.7; }
}

.ai-thinking {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; color: #ffb347;
}

.thinking-dots { display: flex; gap: 3px; }

.thinking-dots span {
  width: 5px; height: 5px;
  background: #ffb347;
  border-radius: 50%;
  animation: bounce 0.8s ease infinite;
}

.thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
.thinking-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%,80%,100% { transform: translateY(0);   opacity: 0.5; }
  40%          { transform: translateY(-6px); opacity: 1;   }
}

/* ─── Metrics ───────────────────────────────────────────────────────────────── */
.metric-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.metric-row:last-child { border-bottom: none; }

.metric-label { font-size: 11px; color: rgba(255,255,255,0.4); }
.metric-value { font-size: 13px; color: rgba(255,255,255,0.85); font-weight: 600; font-variant-numeric: tabular-nums; }

.highlighted-metrics {
  border-color: rgba(6,214,160,0.4) !important;
  animation: pulse-card 1s ease infinite;
}

@keyframes pulse-card {
  0%,100% { box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
  50%     { box-shadow: 0 8px 24px rgba(6,214,160,0.2); }
}

/* ─── Settings ──────────────────────────────────────────────────────────────── */
.setting-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 8px;
}

.setting-label { font-size: 12px; color: rgba(255,255,255,0.5); }

.depth-ctrl {
  display: flex; align-items: center; gap: 6px;
  background: #0f1e38;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 3px 6px;
}

.depth-btn {
  width: 22px; height: 22px;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.15);
  background: transparent;
  color: white;
  cursor: pointer;
  font-size: 14px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
  line-height: 1;
}

.depth-btn:hover { background: rgba(255,78,106,0.2); border-color: #ff4e6a; }
.depth-val { min-width: 20px; text-align: center; font-size: 13px; color: white; }

/* ─── Buttons ───────────────────────────────────────────────────────────────── */
.btn {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.2s;
  letter-spacing: 0.5px;
}

.btn-primary {
  background: linear-gradient(135deg, #ff4e6a, #ff7e47);
  color: white;
  box-shadow: 0 4px 16px rgba(255,78,106,0.3);
}

.btn-primary:hover  { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,78,106,0.4); }
.btn-primary:active { transform: translateY(0); }

.btn-secondary {
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.1);
}

.btn-secondary:hover    { background: rgba(255,255,255,0.1); color: white; }
.btn-secondary:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }

/* ─── Move History ──────────────────────────────────────────────────────────── */
.move-history {
  max-height: 120px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.1) transparent;
}

.move-item {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  padding: 3px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.move-item.human-move { color: rgba(255,78,106,0.7);   }
.move-item.ai-move    { color: rgba(255,179,71,0.7);   }

/* ─── Onboarding Modal ──────────────────────────────────────────────────────── */
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(8px);
  z-index: 100;
  display: flex; align-items: center; justify-content: center;
}

.modal {
  background: linear-gradient(145deg, #0c1830, #0f2040);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 24px;
  padding: 40px;
  max-width: 560px; width: 90%;
  box-shadow: 0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05);
  position: relative;
  overflow: hidden;
}

.modal::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, #ff4e6a, #ffb347, transparent);
}

.modal-icon  { font-size: 48px; text-align: center; margin-bottom: 16px; display: block; }
.modal h2    { font-family: 'Righteous', cursive; font-size: 1.6rem; color: white; text-align: center; margin-bottom: 12px; letter-spacing: 1px; }
.modal p     { color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.7; text-align: center; margin-bottom: 20px; }

.features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }

.feature-item {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 12px;
  display: flex; align-items: flex-start; gap: 10px;
}

.feature-icon { font-size: 20px; flex-shrink: 0; line-height: 1; }
.feature-text h4 { font-size: 12px; color: white; font-weight: 600; margin-bottom: 2px; }
.feature-text p  { font-size: 11px; color: rgba(255,255,255,0.45); line-height: 1.4; margin: 0; text-align: left; }

.modal-btns { display: flex; gap: 10px; margin-top: 8px; }

/* ─── Tutorial Banner ───────────────────────────────────────────────────────── */
.tutorial-banner {
  position: fixed;
  bottom: 24px; left: 50%; transform: translateX(-50%);
  background: linear-gradient(135deg, #0f2040, #1a3060);
  border: 1px solid rgba(6,214,160,0.4);
  border-radius: 16px;
  padding: 16px 24px;
  max-width: 500px; width: 90%;
  z-index: 50;
  box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(6,214,160,0.1);
  display: flex; gap: 16px; align-items: flex-start;
}

.tutorial-step-icon {
  background: rgba(6,214,160,0.15);
  border: 1px solid rgba(6,214,160,0.3);
  border-radius: 50%;
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.tutorial-content  { flex: 1; }
.tutorial-title    { font-size: 13px; font-weight: 700; color: #06d6a0; margin-bottom: 4px; }
.tutorial-desc     { font-size: 12px; color: rgba(255,255,255,0.6); line-height: 1.5; }

.tutorial-progress { display: flex; gap: 4px; margin-top: 8px; }

.prog-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  transition: all 0.3s;
}

.prog-dot.active { background: #06d6a0; }
.prog-dot.done   { background: rgba(6,214,160,0.4); }

.skip-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 6px;
  color: rgba(255,255,255,0.4);
  font-size: 11px;
  padding: 4px 10px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  margin-top: 8px;
  transition: all 0.2s;
}

.skip-btn:hover { color: white; border-color: rgba(255,255,255,0.3); }

/* ─── Result Card ───────────────────────────────────────────────────────────── */
.result-banner {
  position: fixed; inset: 0; z-index: 80;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
}

.result-card {
  background: linear-gradient(145deg, #0c1830, #0f2040);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 24px;
  padding: 40px 48px;
  text-align: center;
  box-shadow: 0 40px 80px rgba(0,0,0,0.8);
  animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes popIn {
  from { transform: scale(0.7); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

.result-emoji { font-size: 64px; display: block; margin-bottom: 16px; }
.result-title { font-family: 'Righteous', cursive; font-size: 2rem; color: white; margin-bottom: 8px; }
.result-sub   { color: rgba(255,255,255,0.5); font-size: 14px; margin-bottom: 28px; }
`;
