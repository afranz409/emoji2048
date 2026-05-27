import { useEffect, useRef, useState } from 'react'
import { GameProvider, useGame } from './context/GameContext.jsx'
import { saveStateToStorage } from './state/gameReducer.js'
import Header from './components/Header.jsx'
import Board from './components/Board.jsx'
import InputHandler from './components/InputHandler.jsx'
import Footer from './components/Footer.jsx'

function GameApp() {
  const { state, dispatch } = useGame()
  const boardRef = useRef(null)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    if (state.mergedCells.size > 0 || state.newCells.size > 0) {
      const t = setTimeout(() => dispatch({ type: 'CLEAR_ANIMATIONS' }), 250)
      return () => clearTimeout(t)
    }
  }, [state.mergedCells, state.newCells, dispatch])

  useEffect(() => {
    saveStateToStorage(state)
  }, [state])

  return (
    <div className="app">
      <Header />
      <Board boardRef={boardRef} showHelp={showHelp} onHelpClose={() => setShowHelp(false)} />
      <InputHandler boardRef={boardRef} />
      <Footer onHelpOpen={() => setShowHelp(true)} />
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
