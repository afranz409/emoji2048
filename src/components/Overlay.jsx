import { useGame } from '../context/GameContext.jsx'

export default function Overlay() {
  const { state, dispatch } = useGame()

  if (state.status !== 'won' && state.status !== 'lost') return null

  const isWon = state.status === 'won'

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={isWon ? 'You won!' : 'Game over'}>
      <span className="overlay__emoji">{isWon ? '🌈' : '💀'}</span>
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
      </div>
    </div>
  )
}
