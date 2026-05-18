import { TILE_CONFIG } from '../theme.js'
import { createEmptyGrid, spawnTile } from '../logic/grid.js'
import { applyMove } from '../logic/moves.js'
import { checkWon, checkLost } from '../logic/status.js'

function loadBestFromStorage() {
  try {
    return parseInt(localStorage.getItem('emoji2048_best') ?? '0', 10) || 0
  } catch {
    return 0
  }
}

function saveBestToStorage(value) {
  try {
    localStorage.setItem('emoji2048_best', String(value))
  } catch { /* private browsing may throw */ }
}

function findNewCell(before, after) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (before[r][c] === null && after[r][c] !== null) return `${r},${c}`
    }
  }
  return null
}

function buildInitialState() {
  const empty = createEmptyGrid()
  const afterFirst = spawnTile(empty)
  const grid = spawnTile(afterFirst)

  const newCells = new Set()
  const firstKey = findNewCell(empty, afterFirst)
  const secondKey = findNewCell(afterFirst, grid)
  if (firstKey) newCells.add(firstKey)
  if (secondKey) newCells.add(secondKey)

  return {
    grid,
    score: 0,
    best: loadBestFromStorage(),
    history: null,
    status: 'playing',
    mergedCells: new Set(),
    newCells,
    keepGoing: false,
  }
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'MOVE': {
      if (state.status !== 'playing' && !state.keepGoing) return state

      const savedHistory = { grid: state.grid, score: state.score }
      const { grid: movedGrid, score: delta, mergedCells: mergedArr, changed } =
        applyMove(state.grid, action.direction, TILE_CONFIG)

      if (!changed) return { ...state, mergedCells: new Set(), newCells: new Set() }

      const spawnedGrid = spawnTile(movedGrid)
      const newCellKey = findNewCell(movedGrid, spawnedGrid)
      const newCells = new Set(newCellKey ? [newCellKey] : [])
      const mergedCells = new Set(mergedArr.map(([r, c]) => `${r},${c}`))

      const newScore = state.score + delta
      const newBest = Math.max(state.best, newScore)
      if (newBest > state.best) saveBestToStorage(newBest)

      let status
      if (checkWon(spawnedGrid, TILE_CONFIG) && !state.keepGoing) {
        status = 'won'
      } else if (checkLost(spawnedGrid)) {
        status = 'lost'
      } else {
        status = 'playing'
      }

      return {
        ...state,
        grid: spawnedGrid,
        score: newScore,
        best: newBest,
        history: savedHistory,
        status,
        mergedCells,
        newCells,
      }
    }

    case 'UNDO': {
      if (!state.history) return state
      return {
        ...state,
        grid: state.history.grid,
        score: state.history.score,
        history: null,
        status: 'playing',
        mergedCells: new Set(),
        newCells: new Set(),
      }
    }

    case 'NEW_GAME': {
      const fresh = buildInitialState()
      return { ...fresh, best: state.best }
    }

    case 'KEEP_GOING':
      return { ...state, keepGoing: true, status: 'playing' }

    case 'CLEAR_ANIMATIONS':
      return { ...state, mergedCells: new Set(), newCells: new Set() }

    default:
      return state
  }
}

export { buildInitialState, gameReducer, loadBestFromStorage }
