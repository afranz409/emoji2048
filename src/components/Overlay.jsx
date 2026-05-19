import { useState, useMemo } from 'react'
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

function ClipboardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

export default function Overlay() {
  const { state, dispatch, tileConfig, winTier } = useGame()
  const [copied, setCopied] = useState(false)

  const isWon = state.status === 'won'

  const quip = useMemo(() => {
    if (state.status !== 'won' && state.status !== 'lost') return ''
    const quips = isWon ? WIN_QUIPS : LOSS_QUIPS
    return quips[Math.floor(Math.random() * quips.length)](state.score)
  }, [state.status, state.score, isWon])

  if (state.status !== 'won' && state.status !== 'lost') return null

  const shareText = `${quip}\n\n${PROJECT_URL}`

  function handleCopy() {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  function handleShare() {
    navigator.share({ text: shareText }).catch(() => {})
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={isWon ? 'You won!' : 'Game over'}>
      <span className="overlay__emoji">{isWon ? tileConfig[winTier].emoji : '💀'}</span>
      <p className="overlay__heading">{isWon ? 'You won!' : 'No moves left.'}</p>
      <p className="overlay__sub">
        {isWon ? 'Keep going or start fresh.' : `Final score: ${state.score}`}
      </p>

      <div className="overlay__quip">
        <p className="overlay__quip-text">{quip}</p>
        <button
          className="overlay__copy-btn"
          onClick={handleCopy}
          aria-label="Copy result to clipboard"
        >
          {copied ? <CheckIcon /> : <ClipboardIcon />}
        </button>
      </div>

      <div className="overlay__actions">
        {isWon && (
          <button className="btn" onClick={() => dispatch({ type: 'KEEP_GOING' })}>
            Keep Going
          </button>
        )}
        <button className="btn" onClick={() => dispatch({ type: 'NEW_GAME' })}>
          New Game
        </button>
        {navigator.share && (
          <button className="btn" onClick={handleShare} aria-label="Share your result">
            Share
          </button>
        )}
      </div>
    </div>
  )
}
