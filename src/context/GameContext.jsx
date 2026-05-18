import { createContext, useContext, useReducer } from 'react'
import { TILE_CONFIG } from '../theme.js'
import { buildInitialState, gameReducer } from '../state/gameReducer.js'

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, () =>
    buildInitialState(TILE_CONFIG)
  )

  return (
    <GameContext.Provider value={{ state, dispatch, tileConfig: TILE_CONFIG }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
