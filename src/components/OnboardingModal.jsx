/**
 * components/OnboardingModal.jsx
 * Welcome screen shown the first time the app loads.
 * Explains game features and lets the user choose between
 * jumping straight in or following the guided tutorial.
 *
 * Props:
 *   onStart    () => void  — skip tutorial, go directly to free play
 *   onTutorial () => void  — start the guided tutorial
 */

const FEATURES = [
  {
    icon: "🎯",
    title: "Cara Menang",
    desc: "Susun 4 keping berurutan di arah apapun",
  },
  {
    icon: "🤖",
    title: "Lawan AI",
    desc: "AI pakai Alpha-Beta Pruning untuk efisiensi",
  },
  {
    icon: "⚡",
    title: "Klik Kolom",
    desc: "Keping jatuh ke bawah otomatis di kolom terpilih",
  },
  {
    icon: "🧠",
    title: "Atur Kesulitan",
    desc: "Ubah kedalaman kalkulasi AI (depth)",
  },
  {
    icon: "📊",
    title: "Live Metrik",
    desc: "Pantau nodes & waktu kalkulasi AI realtime",
  },
  { icon: "↩️", title: "Undo", desc: "Batalkan gerakan terakhirmu kapan saja" },
];

export function OnboardingModal({ onStart, onTutorial }) {
  return (
    <div className="overlay">
      <div className="modal">
        <span className="modal-icon">🔴</span>
        <h2>Connect Four</h2>
        <p>
          Sambungkan 4 keping warnamu secara berurutan — horizontal, vertikal,
          atau diagonal — sebelum AI melakukannya!
        </p>

        <div className="features-grid">
          {FEATURES.map(({ icon, title, desc }) => (
            <div className="feature-item" key={title}>
              <span className="feature-icon">{icon}</span>
              <div className="feature-text">
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-btns">
          <button
            className="btn btn-secondary"
            onClick={onStart}
            style={{ flex: 1 }}
          >
            Langsung Main
          </button>
          <button
            className="btn btn-primary"
            onClick={onTutorial}
            style={{ flex: 1.5 }}
          >
            🎓 Mulai Tutorial
          </button>
        </div>
      </div>
    </div>
  );
}
