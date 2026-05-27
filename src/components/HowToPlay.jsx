import { useState } from 'react'

const RULES = [
  { icon: '↕↔', text: 'Swipe or use arrow keys to slide all tiles.' },
  { icon: '✨', text: 'Two matching tiles merge into the next tier.' },
  { icon: '👻', text: 'Reach the Ghost (2048) to win.' },
  { icon: '↩', text: 'Undo button or Z key takes back one move.' },
  { icon: '🌈', text: 'Keep Going after winning to chase the Rainbow (4096).' },
]

export default function HowToPlay() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="btn btn--icon-label"
        onClick={() => setOpen(true)}
        aria-label="How to play"
      >
        ?
      </button>

      {open && (
        <div className="htp-backdrop" role="dialog" aria-modal="true" aria-label="How to play" onClick={() => setOpen(false)}>
          <div className="htp-modal" onClick={e => e.stopPropagation()}>
            <h2 className="htp-heading">How to Play</h2>
            <ul className="htp-rules">
              {RULES.map(({ icon, text }) => (
                <li key={text} className="htp-rule">
                  <span className="htp-rule__icon" aria-hidden="true">{icon}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <button className="btn htp-close" onClick={() => setOpen(false)}>Got it</button>
          </div>
        </div>
      )}
    </>
  )
}
