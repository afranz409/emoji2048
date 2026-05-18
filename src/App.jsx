import { useEffect, useRef } from 'react'
import { GameProvider, useGame } from './context/GameContext.jsx'
import Header from './components/Header.jsx'
import Board from './components/Board.jsx'
import InputHandler from './components/InputHandler.jsx'

function GameApp() {
  const { state, dispatch } = useGame()
  const boardRef = useRef(null)

  useEffect(() => {
    if (state.mergedCells.size > 0 || state.newCells.size > 0) {
      const t = setTimeout(() => dispatch({ type: 'CLEAR_ANIMATIONS' }), 250)
      return () => clearTimeout(t)
    }
  }, [state.mergedCells, state.newCells, dispatch])

  return (
    <div className="app">
      <Header />
      <Board boardRef={boardRef} />
      <InputHandler boardRef={boardRef} />
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  )
}
