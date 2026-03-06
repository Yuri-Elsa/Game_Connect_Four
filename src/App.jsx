import { gameStyles } from "./styles/gameStyles.js";
import { useGameState } from "./hooks/useGameState.js";
import { TUTORIAL_STEPS } from "./constants/tutorialSteps.js";
import {
  PHASE_ONBOARDING,
  PHASE_TUTORIAL,
  PHASE_PLAYING,
} from "./constants/board.js";

import { Stars } from "./components/Stars.jsx";
import { GameBoard } from "./components/GameBoard.jsx";
import { SidePanel } from "./components/SidePanel.jsx";
import { OnboardingModal } from "./components/OnboardingModal.jsx";
import { TutorialBanner } from "./components/TutorialBanner.jsx";
import { ResultCard } from "./components/ResultCard.jsx";

export default function App() {
  const {
    board,
    currentPlayer,
    winner,
    winCells,
    gameOver,
    showResult,
    droppingCell,
    aiThinking,
    metrics,
    depth,
    setDepth,
    moveHistory,
    boardHistory,
    phase,
    tutorialStep,
    handleColClick,
    handleUndo,
    handleRestart,
    startTutorial,
    skipTutorial,
    finishTutorial,
  } = useGameState();

  const isTutorial = phase === PHASE_TUTORIAL;
  const currentTutorialStep = TUTORIAL_STEPS[tutorialStep];

  const tutorialHighlightCol =
    isTutorial && currentTutorialStep?.forceCol !== undefined
      ? currentTutorialStep.forceCol
      : undefined;

  const tutorialHighlightMetrics =
    isTutorial && currentTutorialStep?.highlight === "metrics";

  const showTutorialBanner =
    isTutorial && tutorialStep < TUTORIAL_STEPS.length - 1;

  const showTutorialFinish =
    isTutorial && tutorialStep === TUTORIAL_STEPS.length - 1;

  return (
    <>
      <style>{gameStyles}</style>

      <div className="app">
        <Stars />

        {phase === PHASE_ONBOARDING && (
          <OnboardingModal
            onStart={() => {
              handleRestart();
              skipTutorial();
            }}
            onTutorial={startTutorial}
          />
        )}

        <div className="game-container">
          <div className="board-section">
            <div className="title">CONNECT FOUR</div>

            <GameBoard
              board={board}
              currentPlayer={currentPlayer}
              winCells={winCells}
              droppingCell={droppingCell}
              aiThinking={aiThinking}
              gameOver={gameOver}
              tutorialHighlightCol={tutorialHighlightCol}
              onColClick={handleColClick}
            />

            <div className="legend">
              <div className="legend-item">
                <div className="legend-disc p1" /> Kamu (Merah)
              </div>
              <div className="legend-item">
                <div className="legend-disc p2" /> AI (Kuning)
              </div>
            </div>
          </div>

          <SidePanel
            currentPlayer={currentPlayer}
            winner={winner}
            gameOver={gameOver}
            aiThinking={aiThinking}
            metrics={metrics}
            depth={depth}
            setDepth={setDepth}
            moveHistory={moveHistory}
            boardHistoryLen={boardHistory.length}
            tutorialHighlightMetrics={tutorialHighlightMetrics}
            onRestart={handleRestart}
            onUndo={handleUndo}
            onTutorial={startTutorial}
          />
        </div>

        {showTutorialBanner && (
          <TutorialBanner
            step={tutorialStep}
            total={TUTORIAL_STEPS.length}
            onSkip={skipTutorial}
          />
        )}

        {showTutorialFinish && (
          <div className="result-banner">
            <div className="result-card">
              <span className="result-emoji">🎓</span>
              <div className="result-title" style={{ color: "#06d6a0" }}>
                Tutorial Selesai!
              </div>
              <div className="result-sub">
                Kamu sudah paham cara bermain. Sekarang tantang AI sungguhan!
              </div>
              <button className="btn btn-primary" onClick={finishTutorial}>
                🎮 Mulai Bermain!
              </button>
            </div>
          </div>
        )}

        {showResult && phase === PHASE_PLAYING && (
          <ResultCard winner={winner} onRestart={handleRestart} />
        )}
      </div>
    </>
  );
}
