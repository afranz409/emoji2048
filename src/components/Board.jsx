import { useGame } from '../context/GameContext.jsx'
import Cell from './Cell.jsx'
import Overlay from './Overlay.jsx'

export default function Board({ boardRef }) {
  const { state } = useGame()

  return (
    <div className="board-wrap" ref={boardRef}>
      <div className="board" role="grid" aria-label="2048 game board">
        {state.grid.map((rowArr, row) =>
          rowArr.map((tier, col) => (
            <Cell key={`${row},${col}`} row={row} col={col} tier={tier} />
          ))
        )}
      </div>
      <Overlay />
    </div>
  )
}
