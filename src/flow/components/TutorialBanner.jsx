/**
 * components/TutorialBanner.jsx
 * Floating banner at the bottom of the screen that guides the player
 * step-by-step through the tutorial.
 *
 * Props:
 *   step    number   Current zero-based step index
 *   total   number   Total number of steps
 *   onSkip  () => void
 */

import { TUTORIAL_STEPS } from "../constants/tutorialSteps.js";

export function TutorialBanner({ step, total, onSkip }) {
  const current = TUTORIAL_STEPS[step];
  if (!current) return null;

  return (
    <div className="tutorial-banner">
      <div className="tutorial-step-icon">{current.icon}</div>

      <div className="tutorial-content">
        <div className="tutorial-title">{current.title}</div>
        <div className="tutorial-desc">{current.desc}</div>

        {/* Progress dots */}
        <div className="tutorial-progress">
          {TUTORIAL_STEPS.map((_, i) => (
            <div
              key={i}
              className={`prog-dot ${i === step ? "active" : i < step ? "done" : ""}`}
            />
          ))}
        </div>

        <button className="skip-btn" onClick={onSkip}>
          Lewati Tutorial
        </button>
      </div>
    </div>
  );
}
