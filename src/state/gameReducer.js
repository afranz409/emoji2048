import { TILE_CONFIG, WIN_TIER } from '../theme.js'
import { createEmptyGrid, spawnTile } from '../logic/grid.js'
import { applyMove } from '../logic/moves.js'
import { checkWon, checkLost } from '../logic/status.js'

const STATE_KEY = 'emoji2048_state'

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

function saveStateToStorage(state) {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify({
      grid: state.grid,
      score: state.score,
      history: state.history,
      status: state.status,
      keepGoing: state.keepGoing,
    }))
  } catch { /* ignore */ }
}

function loadStateFromStorage() {
  try {
    const raw = localStorage.getItem(STATE_KEY)
    if (!raw) return null
    const s = JSON.parse(raw)
    if (
      !Array.isArray(s.grid) || s.grid.length !== 4 ||
      !s.grid.every(row => Array.isArray(row) && row.length === 4) ||
      typeof s.score !== 'number' ||
      !['playing', 'won', 'lost'].includes(s.status)
    ) return null
    return s
  } catch {
    return null
  }
}

function findNewCell(before, after) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (before[r][c] === null && after[r][c] !== null) return `${r},${c}`
    }
  }
  return null
}

// Used for NEW_GAME — always starts fresh, never reads storage.
function buildFreshState() {
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

// Used on app init — restores saved session if valid, otherwise fresh.
function buildInitialState() {
  const saved = loadStateFromStorage()
  if (saved) {
    return {
      grid: saved.grid,
      score: saved.score,
      best: loadBestFromStorage(),
      history: saved.history ?? null,
      status: saved.status,
      keepGoing: saved.keepGoing ?? false,
      mergedCells: new Set(),
      newCells: new Set(),
    }
  }
  return buildFreshState()
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
      if (checkWon(spawnedGrid, WIN_TIER) && !state.keepGoing) {
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

    case 'NEW_GAME':
      return { ...buildFreshState(), best: state.best }

    case 'KEEP_GOING':
      return { ...state, keepGoing: true, status: 'playing' }

    case 'CLEAR_ANIMATIONS':
      return { ...state, mergedCells: new Set(), newCells: new Set() }

    default:
      return state
  }
}

export { buildInitialState, gameReducer, loadBestFromStorage, saveStateToStorage }
