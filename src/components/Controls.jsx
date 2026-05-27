import { useGame } from '../context/GameContext.jsx'

export default function Controls() {
  const { state, dispatch } = useGame()
  const canUndo = state.history !== null

  return (
    <div className="controls">
      <button className="btn" onClick={() => dispatch({ type: 'NEW_GAME' })} aria-label="Start a new game">
        New Game
      </button>
      <button
        className={`btn${canUndo ? '' : ' btn--disabled'}`}
        onClick={() => dispatch({ type: 'UNDO' })}
        aria-label="Undo last move"
        aria-disabled={!canUndo}
      >
        Undo
      </button>
    </div>
  )
}
