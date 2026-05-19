import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'

const PROJECT_URL = 'https://afranz409.github.io/emoji2048/'

const WIN_QUIPS = [
  (s) => `Summoned the ghost and lived to tell the tale. ${s} pts 👻`,
  (s) => `2048 unlocked. The emoji journey is complete. ${s} pts 👻`,
  (s) => `Reached peak emoji enlightenment at ${s} pts. 👻`,
]

const LOSS_QUIPS = [
  (s) => `The tiles won. I did not. ${s} pts 💀`,
  (s) => `Ran out of room at ${s} pts. Dignity: also gone. 💀`,
  (s) => `Turns out ${s} pts isn't enough. The grid disagrees. 💀`,
]

function buildShareText(isWon, score) {
  const quips = isWon ? WIN_QUIPS : LOSS_QUIPS
  const quip = quips[Math.floor(Math.random() * quips.length)](score)
  return `${quip}\n\n${PROJECT_URL}`
}

export default function Overlay() {
  const { state, dispatch, tileConfig, winTier } = useGame()
  const [copied, setCopied] = useState(false)

  if (state.status !== 'won' && state.status !== 'lost') return null

  const isWon = state.status === 'won'

  function handleShare() {
    const text = buildShareText(isWon, state.score)
    if (navigator.share) {
      navigator.share({ text }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }).catch(() => {})
    }
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={isWon ? 'You won!' : 'Game over'}>
      <span className="overlay__emoji">{isWon ? tileConfig[winTier].emoji : '💀'}</span>
      <p className="overlay__heading">{isWon ? 'You won!' : 'No moves left.'}</p>
      <p className="overlay__sub">
        {isWon ? 'Keep going or start fresh.' : `Final score: ${state.score}`}
      </p>
      <div className="overlay__actions">
        {isWon && (
          <button className="btn" onClick={() => dispatch({ type: 'KEEP_GOING' })}>
            Keep Going
          </button>
        )}
        <button className="btn" onClick={() => dispatch({ type: 'NEW_GAME' })}>
          New Game
        </button>
        <button className="btn" onClick={handleShare} aria-label="Share your result">
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>
    </div>
  )
}
