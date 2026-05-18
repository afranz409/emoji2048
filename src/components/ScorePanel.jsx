import { useGame } from '../context/GameContext.jsx'
import ScoreBlock from './ScoreBlock.jsx'

export default function ScorePanel() {
  const { state } = useGame()
  return (
    <div className="score-panel">
      <ScoreBlock label="SCORE" score={state.score} />
      <ScoreBlock label="BEST" score={state.best} />
    </div>
  )
}
