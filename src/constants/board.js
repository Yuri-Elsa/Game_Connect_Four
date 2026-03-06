// ─── Board Dimensions ──────────────────────────────────────────────────────────
export const ROWS = 6;
export const COLS = 7;

// ─── Players ───────────────────────────────────────────────────────────────────
export const PLAYER_HUMAN = 1;
export const PLAYER_AI = 2;
export const DRAW = 0;

// ─── AI Defaults ──────────────────────────────────────────────────────────────
export const DEFAULT_DEPTH = 4;
export const AI_TIME_LIMIT_SEC = 2.0;
export const AI_MOVE_DELAY_MS = 600; // ms before AI "plays" (UX delay)

// ─── App Phases ───────────────────────────────────────────────────────────────
export const PHASE_ONBOARDING = "onboarding";
export const PHASE_TUTORIAL = "tutorial";
export const PHASE_PLAYING = "playing";
