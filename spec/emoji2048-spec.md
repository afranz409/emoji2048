# Emoji 2048 — Full Implementation Spec

**Version:** 1.0  
**Status:** Ready for implementation  
**Target:** Single React JSX artifact (extractable to full project structure)

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Tile Progression System](#2-tile-progression-system)
3. [Visual Design System](#3-visual-design-system)
4. [Game Logic](#4-game-logic)
5. [State Architecture](#5-state-architecture)
6. [Component Architecture](#6-component-architecture)
7. [Animation System](#7-animation-system)
8. [Input Handling](#8-input-handling)
9. [Persistence](#9-persistence)
10. [Accessibility](#10-accessibility)
11. [File Structure](#11-file-structure)
12. [Acceptance Criteria](#12-acceptance-criteria)
13. [Future Extensions](#13-future-extensions)

---

## 1. Product Overview

### 1.1 Concept

A modernized clone of the viral puzzle game 2048, replacing numbers with emoji. The core mechanic is identical: slide tiles on a 4×4 grid; two matching tiles collapse into the next tier. The game ends when no moves remain (loss) or the final emoji tier is reached (win).

The differentiating design intent is **luxury dark aesthetic with per-tier jewel-toned tile identities**, making each tier feel like a distinct character rather than a numbered cell.

### 1.2 Scope (V1)

- Full 2048 game loop on a 4×4 grid
- 12-tier Emotion Arc emoji progression
- Keyboard and touch swipe input
- 1-step undo
- Current score + all-time best (localStorage)
- Win and loss states with restart
- Merge burst and spawn pop-in animations
- Fully responsive, mobile-first layout

### 1.3 Out of Scope (V1)

- Multiple themes / theme switcher (architected for, not built)
- Sound effects
- Time attack or alternate game modes
- Leaderboards or multiplayer
- Accounts or cloud sync

---

## 2. Tile Progression System

### 2.1 Design Principle

The entire progression is defined in a single `TILE_CONFIG` array. **No game logic, rendering, or styling code may hardcode tier counts, emoji values, or colors.** All such values must be derived from `TILE_CONFIG` at runtime. This makes theme swapping a single import change.

### 2.2 TILE_CONFIG Schema

Each entry in the array represents one tier. Index 0 is the spawn tile; index `length - 1` is the win tile.

```
TileConfig {
  emoji:  string   // Single emoji character
  label:  string   // URL-safe slug for analytics, a11y, future theming
  bg:     string   // CSS hex color — tile background
  glow:   string   // CSS hex color — box-shadow glow on hover and merge
  text:   string   // CSS hex color — fallback text color if emoji fails to render
}
```

### 2.3 Emotion Arc — V1 Theme

| Index | Value | Emoji | Label       | bg (hex) | glow (hex) |
|-------|-------|-------|-------------|----------|------------|
| 0     | 2     | 😶    | blank       | #2d3561  | #4a5298    |
| 1     | 4     | 🙂    | smile       | #1a6b5a  | #2db88a    |
| 2     | 8     | 😊    | happy       | #4a7c20  | #7bc832    |
| 3     | 16    | 😄    | grin        | #8a6200  | #f0a500    |
| 4     | 32    | 😂    | tears       | #a04000  | #ff6a00    |
| 5     | 64    | 😍    | hearteyes   | #8a1a3a  | #f03070    |
| 6     | 128   | 🤩    | starstruck  | #6a0a8a  | #c020f0    |
| 7     | 256   | 😱    | screaming   | #1a2a6a  | #4060f0    |
| 8     | 512   | 🤯    | mindblown   | #6a1a00  | #ff3000    |
| 9     | 1024  | 💀    | skull       | #1a1a1a  | #888888    |
| 10    | 2048  | 👻    | ghost       | #0a2a3a  | #40c0ff    |
| 11    | 4096  | 🌈    | rainbow     | #1a0a3a  | #ff80ff    |

> **Note on values:** The numeric "value" column exists only for score calculation (merging tier N produces `2^(N+1)` points). It is not displayed anywhere in the UI. Win condition = any cell reaches index 11.

### 2.4 Theme Swappability Contract

- `TILE_CONFIG` is exported from a dedicated `theme.js` module (or top of the file if single-artifact).
- Win condition is always `TILE_CONFIG.length - 1` — never hardcoded as 11.
- Spawn logic uses index 0 (90% chance) and index 1 (10% chance) — never references emoji or value.
- All components receive `tileConfig` as a prop or via context so a future `<ThemePicker>` can inject alternates without remounting the game tree.

---

## 3. Visual Design System

### 3.1 Aesthetic Direction

**Luxury dark.** Near-black surface with deep texture, jewel-toned tile gradient backgrounds per tier, subtle gold structural accents, editorial typography. The emoji are the heroes; the surrounding chrome is rich but restrained.

The overall feel should evoke a premium app — closer to a high-end watch face or a curated music player than a casual browser game.

### 3.2 Color Tokens

```
--color-bg-base:        #0d0d12   /* Page background */
--color-bg-surface:     #13131a   /* Board background */
--color-bg-cell-empty:  #1c1c27   /* Empty cell fill */
--color-border-grid:    #222230   /* Grid lines / cell borders */
--color-accent-gold:    #c9a84c   /* Score labels, structural accents */
--color-text-primary:   #f0ede8   /* Headings, score values */
--color-text-secondary: #6b6880   /* Labels, helper text */
--color-overlay:        rgba(13,13,18,0.85)  /* Win/loss modal overlay */
```

Tile `bg` and `glow` values come entirely from `TILE_CONFIG` — not from this token set.

### 3.3 Typography

- **Display font:** `Playfair Display` (Google Fonts) — used for the game title and score numerals. Conveys luxury and weight.
- **UI font:** `DM Sans` (Google Fonts) — used for labels, buttons, helper text. Clean, modern, pairs well with Playfair.
- **Emoji rendering:** System emoji font. No custom font needed; rely on OS rendering.

Font size scale (rem, base 16px):

```
--text-xs:    0.75rem    /* Helper text */
--text-sm:    0.875rem   /* Labels */
--text-base:  1rem       /* Body */
--text-lg:    1.25rem    /* Button text, score labels */
--text-xl:    1.75rem    /* Score values */
--text-2xl:   2.5rem     /* Game title */
--text-emoji: clamp(1.75rem, 5vw, 2.75rem)  /* Tile emoji, responsive */
```

### 3.4 Board Layout

- Board is a perfect square, max 480px wide, centered on screen.
- 4×4 grid with a uniform gap of `12px` between cells.
- Cell size is derived: `(board_width - 5 * gap) / 4`. At 480px: `(480 - 60) / 4 = 105px`.
- Board has `border-radius: 16px`, `padding: 12px`, background `--color-bg-surface`.
- Board has a subtle `box-shadow: 0 8px 48px rgba(0,0,0,0.6)`.
- A very subtle noise texture SVG overlay (`opacity: 0.04`) adds depth to the board background.

### 3.5 Tile Appearance

Each tile:

- Background: radial gradient from `TILE_CONFIG[tier].glow` (center, 20% opacity) to `TILE_CONFIG[tier].bg` (edge).
- `border-radius: 10px`
- `box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.4)`
- On hover (desktop): `box-shadow` expands with glow color at 40% opacity, tile scales to `1.03`.
- Emoji is centered vertically and horizontally, font-size from `--text-emoji`.
- Empty cells: flat `--color-bg-cell-empty` fill, no shadow, no border.

### 3.6 Header Layout

```
[ EMOJI 2048 ]                  [ Score: 0    Best: 0 ]
                                [ New Game ] [ Undo   ]
```

- Title left-aligned in Playfair Display, gold accent color.
- Score panel right-aligned, two score blocks side by side.
- Controls below score panel, right-aligned.
- On narrow screens (<400px), stack title above score+controls row.

### 3.7 Score Panel

Each score block:

- Label ("SCORE" / "BEST") in `--text-sm`, `--color-accent-gold`, letter-spacing `0.1em`.
- Value in `--text-xl`, `--color-text-primary`, Playfair Display.
- When score increases, the value does a brief upward-nudge animation (`translateY(-4px)` then back, 200ms).

### 3.8 Controls

- **New Game** button: outlined style, gold border, gold text, transparent background. On hover: fills with gold at 10% opacity.
- **Undo** button: same style, but dimmed (`opacity: 0.5`) and `cursor: not-allowed` when no history is available.
- Both buttons: `border-radius: 8px`, `padding: 8px 16px`, DM Sans medium weight.

### 3.9 Win / Loss Overlay

A full-board overlay (not full-screen) appears on win or loss:

- Background: `--color-overlay` with `backdrop-filter: blur(4px)`.
- Centered content: large emoji (🌈 for win, 💀 for loss), headline, sub-copy, "Play Again" button.
- Win: headline "You won!" in gold. Sub-copy: "Keep going or start fresh."  
  Offers two buttons: **Keep Going** (dismisses overlay, game continues) and **New Game**.
- Loss: headline "No moves left." Sub-copy: final score. One button: **New Game**.
- Overlay fades in over 300ms.

---

## 4. Game Logic

All game logic functions are **pure functions** — no side effects, no DOM access, no state mutation. They take data in and return new data out. This makes them trivially testable.

### 4.1 Grid Representation

The grid is a 2D array: `grid[row][col]`. Values are:
- `null` — empty cell
- `number` (0–11) — tier index from TILE_CONFIG

```
type Grid = (number | null)[][]   // 4x4
```

### 4.2 `createEmptyGrid() → Grid`

Returns a 4×4 array filled with `null`.

### 4.3 `spawnTile(grid: Grid) → Grid`

1. Collect all `[row, col]` positions where `grid[row][col] === null`.
2. If none exist, return grid unchanged.
3. Pick a random position from the empty list.
4. Place tier `0` with 90% probability, tier `1` with 10% probability.
5. Return new grid (do not mutate input).

### 4.4 `slideRow(row: (number|null)[]) → SlideResult`

Core merge logic for a single row, sliding left.

```
SlideResult {
  row:    (number|null)[]   // resulting row of length 4
  score:  number            // points earned from merges in this row
  merges: number[]          // column indices where a merge occurred (in output row)
}
```

Algorithm:

1. Filter `null`s: extract non-null values into a compact array.
2. Iterate compact array left to right:
   - If current value equals next value and next has not already been merged this pass:
     - Replace current with `current + 1` (capped at `TILE_CONFIG.length - 1`).
     - Mark next as consumed.
     - Add `2^(merged_tier + 1)` to score.
     - Record merge index.
3. Re-pad with `null`s on the right to length 4.
4. Return result.

> **Cap behavior:** If two tier-11 tiles would merge, the result is capped at tier 11. This situation cannot arise in normal play (tier 11 is the win condition) but the cap prevents array out-of-bounds.

### 4.5 `applyMove(grid: Grid, direction: Direction) → MoveResult`

```
Direction = "left" | "right" | "up" | "down"
MoveResult {
  grid:        Grid
  score:       number       // total score delta from this move
  mergedCells: [row, col][] // output positions of merged tiles
  changed:     boolean      // false if grid is identical to input
}
```

Algorithm:

1. **Normalize to "slide left":** rotate the grid so the target direction becomes left.
   - `left`: no rotation
   - `right`: rotate 180°
   - `up`: rotate 90° clockwise
   - `down`: rotate 90° counter-clockwise
2. Apply `slideRow` to each of the 4 rows.
3. Rotate back to original orientation.
4. Collect score and merged cell positions (re-mapped through rotation).
5. Set `changed = true` if any cell differs between input and output grids.

**Grid rotation helpers** (pure functions):

- `rotateClockwise(grid)`: `grid[row][col] → grid[3-col][row]`
- `rotateCounterClockwise(grid)`: inverse
- `rotate180(grid)`: apply clockwise twice

### 4.6 `checkWon(grid: Grid, tileConfig: TileConfig[]) → boolean`

Returns `true` if any cell value equals `tileConfig.length - 1`.

### 4.7 `checkLost(grid: Grid) → boolean`

Returns `true` when both conditions are met:

1. No `null` cells exist in the grid.
2. No adjacent horizontal or vertical pair of cells has equal values.

Iterate all cells; for each, check right neighbor and bottom neighbor. If any match found, return `false` (moves remain).

### 4.8 `scoreForMerge(tier: number) → number`

Returns `Math.pow(2, tier + 1)`. Called during `slideRow`.

---

## 5. State Architecture

### 5.1 State Shape

```
GameState {
  grid:        Grid                          // current board
  score:       number                        // current game score
  best:        number                        // all-time best, persisted
  history:     { grid: Grid, score: number } | null   // snapshot for undo
  status:      "playing" | "won" | "lost"
  mergedCells: Set<string>                   // "row,col" keys — drives merge animation
  newCells:    Set<string>                   // "row,col" keys — drives spawn animation
  keepGoing:   boolean                       // true after player dismisses win overlay
}
```

### 5.2 Initial State

```
{
  grid:        spawnTile(spawnTile(createEmptyGrid())),  // two tiles on start
  score:       0,
  best:        loadBestFromStorage(),
  history:     null,
  status:      "playing",
  mergedCells: new Set(),
  newCells:    new Set(),   // keys for both initial tiles
  keepGoing:   false,
}
```

### 5.3 Actions

Managed via `useReducer`. All action handlers return new state — no mutation.

#### `MOVE { direction }`

1. If `status !== "playing"` and `keepGoing === false`, ignore.
2. Save `{ grid, score }` to `history`.
3. Call `applyMove(grid, direction)`.
4. If `changed === false`, restore `history` to previous (move was a no-op; don't consume undo slot).
5. Call `spawnTile` on the new grid.
6. Compute new `status`:
   - If `checkWon` and `!keepGoing` → `"won"`
   - Else if `checkLost` → `"lost"`
   - Else → `"playing"`
7. Update `score`, update `best` if `score > best`, persist best.
8. Set `mergedCells` from move result; set `newCells` to position of spawned tile.

#### `UNDO`

1. If `history === null`, ignore.
2. Restore `grid` and `score` from `history`.
3. Set `history = null`.
4. Set `status = "playing"`.
5. Clear `mergedCells` and `newCells`.

#### `NEW_GAME`

Reset to initial state. Preserve `best`. Clear `history`.

#### `KEEP_GOING`

Set `keepGoing = true`, `status = "playing"`. Dismiss win overlay.

#### `CLEAR_ANIMATIONS`

Called after animation frame completes (via `useEffect`). Clears `mergedCells` and `newCells` to empty sets.

---

## 6. Component Architecture

### 6.1 Component Tree

```
<App>
  ├── <GameProvider>          (context: state, dispatch, tileConfig)
  │   ├── <Header>
  │   │   ├── <Title>
  │   │   └── <ScorePanel>
  │   │       ├── <ScoreBlock label="SCORE" />
  │   │       └── <ScoreBlock label="BEST" />
  │   ├── <Controls>
  │   │   ├── <Button> New Game
  │   │   └── <Button> Undo
  │   ├── <Board>
  │   │   └── <Cell> × 16
  │   │       └── <Tile> (when cell is non-null)
  │   └── <Overlay>          (win/loss — conditionally rendered)
  └── <InputHandler>         (keyboard + touch, no visual output)
```

### 6.2 `<App>`

- Initializes `useReducer` with game reducer and initial state.
- Loads `tileConfig` (currently the Emotion Arc; future: from prop or context).
- Wraps children in `<GameProvider>`.
- Renders `<InputHandler>` (invisible).

### 6.3 `<GameProvider>`

React context providing `{ state, dispatch, tileConfig }` to all descendants. No logic; pure pass-through.

### 6.4 `<Header>`

Flex row: title left, score panel right. Reads title from a config constant `GAME_TITLE = "EMOJI 2048"`.

### 6.5 `<ScoreBlock label score>`

- Renders label + value.
- Tracks previous score via `useRef`; when `score` changes, triggers nudge animation class for 200ms then removes it.

### 6.6 `<Controls>`

- **New Game**: dispatches `NEW_GAME`.
- **Undo**: dispatches `UNDO`. Disabled (dimmed, pointer-events none) when `state.history === null`.

### 6.7 `<Board>`

- CSS Grid, 4 columns, gap from design tokens.
- Renders 16 `<Cell>` components at fixed `[row][col]` positions.
- Owns the board dimensions and passes `cellSize` down.

### 6.8 `<Cell row col>`

- Fixed size square (derived from board width).
- Background: `--color-bg-cell-empty`.
- Renders a `<Tile>` if `grid[row][col] !== null`.
- The cell itself never animates — only the tile inside it does.

### 6.9 `<Tile tier row col>`

- Reads `TILE_CONFIG[tier]` for emoji, bg, glow.
- Applies background radial gradient.
- Applies CSS classes for:
  - `tile--new`: pop-in animation (if `newCells` contains this position)
  - `tile--merged`: burst animation (if `mergedCells` contains this position)
- Renders emoji in a centered `<span>`.
- `aria-label` set to `TILE_CONFIG[tier].label` for screen readers.

### 6.10 `<Overlay>`

- Conditionally rendered when `state.status === "won"` or `"lost"`.
- Absolutely positioned over the board, `border-radius` matches board.
- Win state: shows 🌈, "You won!", **Keep Going** and **New Game** buttons.
- Loss state: shows 💀, "No moves left", final score, **New Game** button.
- Entrance: fade-in + subtle scale-up (0.95 → 1.0) over 300ms.

### 6.11 `<InputHandler>`

- Invisible component (`null` render).
- `useEffect` attaches `keydown` listener to `window` on mount; removes on unmount.
- Maps `ArrowLeft/Right/Up/Down` → dispatches `MOVE`.
- Also handles touch events (see §8).

---

## 7. Animation System

All animations are CSS-based. React applies class names; CSS keyframes handle the motion. JavaScript does not drive animation values directly.

### 7.1 Tile Spawn (`tile--new`)

```
@keyframes tileSpawn {
  0%   { transform: scale(0.4); opacity: 0; }
  60%  { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1.0); }
}
```

Duration: `180ms`, easing: `ease-out`. Applied to `<Tile>` when position key is in `newCells`.

### 7.2 Tile Merge Burst (`tile--merged`)

```
@keyframes tileMerge {
  0%   { transform: scale(1.0); }
  30%  { transform: scale(1.18); }
  60%  { transform: scale(0.94); }
  100% { transform: scale(1.0); }
}
```

Duration: `200ms`, easing: `ease-in-out`. Box-shadow also pulses using the tile's glow color:

```
@keyframes tileMergeGlow {
  0%   { box-shadow: 0 0 0px 0px var(--tile-glow); }
  40%  { box-shadow: 0 0 20px 8px var(--tile-glow); }
  100% { box-shadow: 0 0 4px 1px var(--tile-glow); }
}
```

Both keyframes run simultaneously. `--tile-glow` is set as an inline CSS variable on the tile element.

### 7.3 Animation Class Cleanup

After animations complete, `mergedCells` and `newCells` must be cleared so classes are removed and re-triggerable on the next move.

Use a `useEffect` watching `mergedCells` / `newCells`:
- When either is non-empty, set a `setTimeout` for 250ms then dispatch `CLEAR_ANIMATIONS`.

### 7.4 Score Nudge

```
@keyframes scoreNudge {
  0%   { transform: translateY(0); }
  40%  { transform: translateY(-5px); }
  100% { transform: translateY(0); }
}
```

Duration: `200ms`. Applied to the score value element when it changes.

### 7.5 Overlay Entrance

```
@keyframes overlayIn {
  0%   { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1.0); }
}
```

Duration: `300ms`, easing: `ease-out`.

### 7.6 Page Load (Optional Polish)

Stagger the header, controls, and board into view on initial render using `animation-delay`:

- Title: `0ms`
- Score panel: `60ms`
- Controls: `120ms`
- Board: `200ms`

Each element fades up from `translateY(8px)` to `translateY(0)`, opacity 0→1, over 300ms.

---

## 8. Input Handling

### 8.1 Keyboard

Attach a single `keydown` listener on `window`. No input handling should occur when `status === "lost"` or when a modal input (if any) has focus.

| Key          | Action         |
|--------------|----------------|
| ArrowLeft    | `MOVE left`    |
| ArrowRight   | `MOVE right`   |
| ArrowUp      | `MOVE up`      |
| ArrowDown    | `MOVE down`    |
| `z` / `Z`   | `UNDO`         |

Call `event.preventDefault()` for arrow keys to prevent page scroll.

### 8.2 Touch / Swipe

Attach `touchstart` and `touchend` listeners to the board element (not `window`, to avoid interfering with page scroll elsewhere).

Algorithm:

1. On `touchstart`: record `{ x: touch.clientX, y: touch.clientY }`.
2. On `touchend`: compute `dx = end.x - start.x`, `dy = end.y - start.y`.
3. Minimum swipe threshold: **30px** (ignore micro-touches).
4. Dominant axis: `Math.abs(dx) > Math.abs(dy)` → horizontal; else → vertical.
5. Map to direction:
   - Horizontal, dx > 0 → `right`
   - Horizontal, dx < 0 → `left`
   - Vertical, dy > 0 → `down`
   - Vertical, dy < 0 → `up`
6. Dispatch `MOVE direction`.

Do not call `preventDefault` on touch events (allows normal page scroll outside the board).

---

## 9. Persistence

### 9.1 Best Score

- Key: `emoji2048_best`
- On init: `parseInt(localStorage.getItem("emoji2048_best") ?? "0", 10)`
- On update: write only when `newScore > currentBest`
- Wrap all localStorage calls in try/catch (private browsing mode throws).

### 9.2 No Game State Persistence (V1)

The game grid is not persisted across sessions. On page reload, a fresh game starts. This is intentional for V1 simplicity.

---

## 10. Accessibility

- Board cells: `role="gridcell"`, `aria-label` includes tier label (e.g. `"grin tile"` or `"empty"`).
- Grid container: `role="grid"`, `aria-label="2048 game board"`.
- Score regions: `aria-live="polite"` so screen readers announce score changes.
- All buttons: descriptive `aria-label` values.
- Tile emoji `<span>`: `aria-hidden="true"` (the `aria-label` on the cell carries the semantics).
- Keyboard focus: controls are fully keyboard-navigable; the board itself does not need focus (input is captured globally).
- Color is never the sole differentiator — emoji silhouette + color together distinguish tiers.
- Prefers-reduced-motion: all keyframe animations wrapped in `@media (prefers-reduced-motion: no-preference)`. When reduced motion is preferred, tiles appear instantly with no transform animations.

---

## 11. File Structure

### 11.1 Single-Artifact Layout (V1 delivery)

The entire game ships as one `.jsx` file, with internal sections clearly delineated by comments for easy extraction later:

```
emoji2048.jsx
│
├── // === THEME CONFIG ===
│   TILE_CONFIG, GAME_TITLE
│
├── // === GAME LOGIC ===
│   createEmptyGrid, spawnTile, slideRow,
│   applyMove, checkWon, checkLost, scoreForMerge
│   rotateClockwise, rotateCounterClockwise, rotate180
│
├── // === STATE ===
│   gameReducer, initialState, loadBestFromStorage
│
├── // === CONTEXT ===
│   GameContext, GameProvider, useGame
│
├── // === COMPONENTS ===
│   Title, ScoreBlock, ScorePanel, Controls,
│   Header, Tile, Cell, Board, Overlay,
│   InputHandler
│
├── // === STYLES ===
│   <style> block with all CSS custom properties,
│   keyframes, and component styles
│
└── // === ENTRY ===
    export default App
```

### 11.2 Extracted Project Structure (Future)

```
src/
├── themes/
│   ├── emotion.js       (V1 — Emotion Arc)
│   ├── nature.js        (future)
│   └── vibe.js          (future)
├── logic/
│   ├── grid.js          (createEmptyGrid, spawnTile)
│   ├── moves.js         (slideRow, applyMove, rotations)
│   └── status.js        (checkWon, checkLost, scoreForMerge)
├── state/
│   └── gameReducer.js
├── context/
│   └── GameContext.jsx
├── components/
│   ├── App.jsx
│   ├── Board.jsx
│   ├── Cell.jsx
│   ├── Tile.jsx
│   ├── Header.jsx
│   ├── ScoreBlock.jsx
│   ├── Controls.jsx
│   ├── Overlay.jsx
│   └── InputHandler.jsx
├── styles/
│   └── tokens.css
└── hooks/
    └── useInputHandler.js
```

---

## 12. Acceptance Criteria

### 12.1 Game Logic

- [ ] Two tiles (tier 0 or 1) spawn on new game.
- [ ] One tile spawns after every valid move (tier 0 at 90%, tier 1 at 10%).
- [ ] No tile spawns when a move produces no change.
- [ ] Two tiles of the same tier merge into the next tier.
- [ ] A tile can only merge once per move (no chain-merging in a single swipe).
- [ ] Score increases by `2^(merged_tier + 1)` per merge.
- [ ] Win condition triggers when any tile reaches index `TILE_CONFIG.length - 1`.
- [ ] Loss condition triggers when grid is full and no adjacent pairs match.
- [ ] "Keep Going" dismisses win overlay and continues play past the win tile.
- [ ] Undo restores exact previous grid and score.
- [ ] Undo is unavailable when no history exists (button disabled).
- [ ] New Game resets grid and score but preserves best.
- [ ] Best score persists across page reloads.

### 12.2 Visual

- [ ] Each tier renders correct emoji and unique jewel-toned background.
- [ ] Empty cells render in `--color-bg-cell-empty`, no emoji.
- [ ] Board is perfectly square and centered.
- [ ] Layout is correct on 320px–1200px viewport widths.
- [ ] Win overlay appears over board (not full screen) on win.
- [ ] Loss overlay appears over board on loss.

### 12.3 Animation

- [ ] New tiles pop in with spawn animation.
- [ ] Merged tiles burst with scale + glow animation.
- [ ] Score nudges upward when it increases.
- [ ] Animations do not fire on undo or new game (only on natural moves).
- [ ] All animations are suppressed under `prefers-reduced-motion`.

### 12.4 Input

- [ ] Arrow keys move the board in all four directions.
- [ ] Arrow keys do not scroll the page.
- [ ] `Z` key triggers undo.
- [ ] Swipe in any direction on mobile moves the board.
- [ ] Swipe is ignored below 30px threshold.

### 12.5 Theming Contract

- [ ] Replacing `TILE_CONFIG` with a different array of the same schema changes all emoji, colors, and win condition with no other code changes.
- [ ] A theme with 8 tiers and one with 14 tiers both function correctly.

---

## 13. Future Extensions

These are out of scope for V1 but the architecture must not preclude them.

| Feature | Notes |
|---|---|
| **Theme switcher** | `tileConfig` passed via context; UI adds a `<ThemePicker>` that swaps the import |
| **Session persistence** | Serialize `{ grid, score, history }` to localStorage on every move |
| **Sound effects** | Trigger on merge, spawn, win, loss — use Web Audio API or Howler.js |
| **Animated tile slide** | CSS `translate` transitions on tile position change (requires absolute positioning of tiles keyed by tile ID rather than cell position) |
| **Time attack mode** | Add countdown timer to state; loss triggers on timer expiry |
| **Score sharing** | "Share my score" copies emoji grid snapshot to clipboard (like Wordle) |
| **Leaderboard** | Requires backend; store best score + initials |
| **5×5 grid** | Grid size as a config constant; all logic already dimension-agnostic |
| **Accessibility: move announcements** | `aria-live` region announces each move result for screen readers |
