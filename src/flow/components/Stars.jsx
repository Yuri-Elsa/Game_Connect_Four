/**
 * components/Stars.jsx
 * Decorative twinkling stars rendered in the app background.
 * Pure presentational — no props needed.
 */

const STAR_COUNT = 50;

const starData = Array.from({ length: STAR_COUNT }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: Math.random() * 2 + 1,
  delay: Math.random() * 3,
  duration: 2 + Math.random() * 3,
}));

export function Stars() {
  return (
    <div className="stars">
      {starData.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
