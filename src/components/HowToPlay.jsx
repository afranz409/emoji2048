const RULES = [
  { icon: '↕↔', text: 'Swipe or use arrow keys to slide all tiles.' },
  { icon: '✨', text: 'Two matching tiles merge into the next tier.' },
  { icon: '👻', text: 'Reach the Ghost (2048) to win.' },
  { icon: '↩', text: 'Undo button or Z key takes back one move.' },
  { icon: '🌈', text: 'Keep Going after winning to chase the Rainbow (4096).' },
]

export default function HowToPlay({ open, onClose }) {
  if (!open) return null

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="How to play" onClick={onClose}>
      <div className="htp-content" onClick={e => e.stopPropagation()}>
        <h2 className="htp-heading">How to Play</h2>
        <ul className="htp-rules">
          {RULES.map(({ icon, text }) => (
            <li key={text} className="htp-rule">
              <span className="htp-rule__icon" aria-hidden="true">{icon}</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
        <button className="btn htp-close" onClick={onClose}>Got it</button>
      </div>
    </div>
  )
}
