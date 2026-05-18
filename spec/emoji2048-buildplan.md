# Emoji 2048 — Claude Code Build Plan

**8 incremental steps. Each step is independently verifiable before proceeding.**  
Spec lives at `/specs/Emoji2048-spec.md`. Run Claude Code from the project root.

---

## Step 1: Scaffold + Theme Config

**Goal:** Create the file with the correct section structure and the complete `TILE_CONFIG`. Nothing renders yet except a blank page that proves the file loads without errors.

**Deliverable:** `emoji2048.jsx` with THEME CONFIG and ENTRY sections only.

### Claude Code Prompt

```
Read /specs/Emoji2048-spec.md sections 2 and 11.

Create emoji2048.jsx with the following section structure (use section comments exactly as shown in CLAUDE.md):

1. THEME CONFIG — Implement the full TILE_CONFIG array from spec section 2.3. Include GAME_TITLE = "EMOJI 2048". Export both as named exports.

2. STYLES — Add a <style> block (injected via a useEffect in App) with:
   - Google Fonts import for Playfair Display and DM Sans
   - All CSS custom property tokens from spec section 3.2 and 3.3
   - CSS reset: box-sizing border-box, margin 0, padding 0
   - Body background set to var(--color-bg-base)

3. ENTRY — A minimal App function that renders a <div> containing only the text "Emoji 2048 loading..." styled in Playfair Display, gold color. Export default App.

Verify: file loads in browser with no console errors, correct background color, correct font rendering.
```

---

## Step 2: Game Logic (Pure Functions)

**Goal:** Implement all game logic as pure functions. No UI changes. All logic must be verifiable by calling functions directly in the browser console.

**Deliverable:** GAME LOGIC section complete and console-testable.

### Claude Code Prompt

```
Read /specs/Emoji2048-spec.md section 4 in full.

Add the GAME LOGIC section to emoji2048.jsx. Implement these pure functions (named exports):

- createEmptyGrid() — 4x4 array of nulls
- rotateClockwise(grid), rotateCounterClockwise(grid), rotate180(grid)
- slideRow(row) — returns { row, score, merges } per spec 4.4 algorithm exactly
- applyMove(grid, direction) — returns { grid, score, mergedCells, changed } per spec 4.5
- spawnTile(grid) — places tier 0 (90%) or tier 1 (10%) in a random empty cell, returns new grid
- checkWon(grid, tileConfig) — uses tileConfig.length - 1 as win tier, never hardcodes 11
- checkLost(grid)
- scoreForMerge(tier) — returns 2^(tier+1)

Rules:
- Every function is pure — no side effects, no mutation of inputs
- No function references TILE_CONFIG directly — tileConfig is always a parameter
- Add a brief comment only on the rotation helpers explaining the index math

Console test after writing:
  const g = createEmptyGrid();
  const g2 = spawnTile(spawnTile(g));
  console.log(g2); // should show 4x4 with 2 non-null cells
  const result = applyMove(g2, "left");
  console.log(result);
```

---

## Step 3: State + Context

**Goal:** Wire up `useReducer` with the full game reducer and expose state via React context. Still no board UI — just prove state initializes and actions fire correctly.

**Deliverable:** STATE and CONTEXT sections complete.

### Claude Code Prompt

```
Read /specs/Emoji2048-spec.md sections 5.1 through 5.3.

Add STATE and CONTEXT sections to emoji2048.jsx.

STATE section:
- loadBestFromStorage() — reads "emoji2048_best" from localStorage, returns 0 on failure
- saveBestToStorage(value) — writes to localStorage, silently catches errors  
- buildInitialState(tileConfig) — returns the full initial state shape from spec 5.2. Calls spawnTile twice on createEmptyGrid(). Populates newCells with the two spawned tile positions.
- gameReducer(state, action) — handles all 5 actions from spec 5.3: MOVE, UNDO, NEW_GAME, KEEP_GOING, CLEAR_ANIMATIONS. MOVE must: save history only when the move changes the grid, spawn a tile, check win/loss, update best, set mergedCells and newCells.

CONTEXT section:
- GameContext created with createContext
- GameProvider component wraps children; initializes useReducer with gameReducer and buildInitialState(TILE_CONFIG); provides { state, dispatch, tileConfig: TILE_CONFIG }
- useGame() hook that returns useContext(GameContext)

Update App to wrap its content in <GameProvider> and render the score from state: "Score: {state.score}" as a sanity check.

Verify: page loads, shows "Score: 0", no console errors. Open console and confirm state shape by adding a temporary window.dbg = dispatch and calling window.dbg({ type: "NEW_GAME" }).
```

---

## Step 4: Board + Tile Rendering

**Goal:** Render the 4×4 grid with correct empty cells and emoji tiles. No animations yet. Visually matches the luxury dark design spec.

**Deliverable:** Board, Cell, and Tile components. Full board renders with starting 2 tiles.

### Claude Code Prompt

```
Read /specs/Emoji2048-spec.md sections 3.4, 3.5, 6.7, 6.8, 6.9.

Add Board, Cell, and Tile to the COMPONENTS section of emoji2048.jsx.

Board:
- CSS Grid, 4 columns, gap 12px, padding 12px
- Max-width 480px, centered
- Background var(--color-bg-surface), border-radius 16px
- Box-shadow per spec 3.4
- Add a subtle SVG noise texture overlay at 4% opacity (use an inline SVG data URI for an feTurbulence filter)
- Reads grid from useGame()

Cell:
- Square, size derived from board width: (100% - 5*12px) / 4 per column
- Background var(--color-bg-cell-empty), border-radius 10px
- Renders <Tile> if grid[row][col] is not null, nothing otherwise

Tile:
- Reads TILE_CONFIG[tier] for emoji, bg, glow
- Background: radial-gradient from glow at 20% opacity (center) to bg (edge)
- Border-radius 10px, inset highlight box-shadow per spec 3.5
- Emoji centered, font-size var(--text-emoji)
- aria-label set to TILE_CONFIG[tier].label
- Emoji <span> is aria-hidden="true"

Add tile and cell CSS to the STYLES section. Do not use inline styles for anything except the dynamic radial-gradient (which requires the per-tile glow color).

Update App to render <Board /> inside <GameProvider>. Remove the temporary score text.

Verify: 4x4 board renders, 2 emoji tiles visible, remaining cells are dark empty squares, board is centered, fonts correct.
```

---

## Step 5: Input Handling

**Goal:** The game is playable. Arrow keys and touch swipe move tiles. Score updates.

**Deliverable:** InputHandler component, keyboard and touch logic working.

### Claude Code Prompt

```
Read /specs/Emoji2048-spec.md sections 8.1 and 8.2.

Add InputHandler to the COMPONENTS section. It renders null (no visual output).

Keyboard:
- useEffect attaches a keydown listener to window on mount, removes on unmount
- ArrowLeft/Right/Up/Down → dispatch MOVE with corresponding direction
- "z" or "Z" → dispatch UNDO
- Call event.preventDefault() for arrow keys only

Touch:
- Attach touchstart and touchend to the board element
- Pass a boardRef from Board down to InputHandler, or use a ref on the Board div
- Implement swipe detection per spec 8.2: minimum 30px threshold, dominant axis wins
- Do not call preventDefault on touch events

Add <InputHandler /> inside <GameProvider> in App, alongside <Board />.

Verify: arrow keys slide tiles, score increases on merge, Z undoes last move, touch swipe works on mobile or browser dev tools device simulation. Confirm no-op moves do not consume the undo slot (move left when all tiles are already left-packed — undo should not be available after that).
```

---

## Step 6: Header + Controls

**Goal:** Full UI chrome — title, score panel, new game and undo buttons.

**Deliverable:** Header, ScoreBlock, ScorePanel, Controls components. App layout complete.

### Claude Code Prompt

```
Read /specs/Emoji2048-spec.md sections 3.6, 3.7, 3.8, 6.4, 6.5, 6.6.

Add Header, ScoreBlock, ScorePanel, and Controls to the COMPONENTS section.

ScoreBlock({ label, score }):
- Label in var(--text-sm), var(--color-accent-gold), letter-spacing 0.1em, uppercase
- Score value in var(--text-xl), var(--color-text-primary), Playfair Display
- Track previous score with useRef; when score changes, add a CSS class "score--nudge" for 200ms then remove it
- Add the scoreNudge keyframe to STYLES per spec 7.4

ScorePanel:
- Flex row, gap between SCORE and BEST blocks
- Reads state.score and state.best from useGame()

Controls:
- New Game button: dispatches NEW_GAME
- Undo button: dispatches UNDO; disabled (opacity 0.5, pointer-events none) when state.history is null
- Both buttons styled per spec 3.8: outlined gold, DM Sans medium, border-radius 8px
- Hover state: gold fill at 10% opacity

Header:
- Flex row: title (left) + right column containing ScorePanel above Controls
- Title: GAME_TITLE in Playfair Display, var(--text-2xl), var(--color-accent-gold)
- On viewport < 400px: stack title above the score+controls row

Update App layout: Header above Board, max-width 480px, centered, with comfortable vertical spacing.

Verify: title, score, best, new game, and undo all render correctly. Undo button dims when unavailable. Score nudges on merge. Layout responsive at 320px.
```

---

## Step 7: Animations

**Goal:** Merge burst, tile spawn pop-in, and overlay entrance animations. Game feels polished.

**Deliverable:** All CSS keyframes from spec section 7 implemented and firing correctly.

### Claude Code Prompt

```
Read /specs/Emoji2048-spec.md section 7 in full.

Add all animation keyframes to the STYLES section, all wrapped in @media (prefers-reduced-motion: no-preference).

Keyframes to implement:
- tileSpawn (spec 7.1) — applied via class "tile--new"
- tileMerge + tileMergeGlow (spec 7.2) — applied via class "tile--merged". tileMergeGlow uses a CSS variable --tile-glow set as an inline style on the tile element (this is the one permitted inline style exception). Both keyframes run simultaneously.
- scoreNudge (spec 7.4) — already scaffolded in step 6, confirm it's correct
- overlayIn (spec 7.5) — used in step 8

Animation class application:
- Tile component checks if its "row,col" key is in state.mergedCells → adds "tile--merged"
- Tile component checks if its "row,col" key is in state.newCells → adds "tile--new"

Animation cleanup:
- In App (or a dedicated hook), useEffect watching state.mergedCells and state.newCells: when either is non-empty, setTimeout 250ms → dispatch CLEAR_ANIMATIONS

Page load stagger (spec 7.6):
- Header: fade up, 0ms delay
- Controls: fade up, 120ms delay  
- Board: fade up, 200ms delay
- Use a single "fadeUp" keyframe (opacity 0 + translateY 8px → opacity 1 + translateY 0), 300ms each

Verify: new tiles pop in on spawn, merged tiles burst with scale + glow, score nudges, page loads with staggered fade-up. Test with prefers-reduced-motion enabled in browser devtools — all motion should disappear, tiles should appear instantly.
```

---

## Step 8: Win / Loss Overlay + Final Polish

**Goal:** Complete game loop. Win and loss states surface correctly. Final visual pass.

**Deliverable:** Overlay component, win/loss states, full game playable end-to-end.

### Claude Code Prompt

```
Read /specs/Emoji2048-spec.md sections 3.9, 6.10, and 12 (acceptance criteria).

Add Overlay to the COMPONENTS section.

Overlay:
- Renders only when state.status === "won" or "lost"
- Positioned absolutely over the Board div (Board needs position: relative)
- Background var(--color-overlay) with backdrop-filter: blur(4px)
- Border-radius matches the board
- Centered content with flexbox column
- Win state: renders 🌈 emoji large, "You won!" heading in var(--color-accent-gold), "Keep going or start fresh." sub-copy, two buttons: "Keep Going" (dispatches KEEP_GOING) and "New Game" (dispatches NEW_GAME)
- Loss state: renders 💀 emoji large, "No moves left." heading, final score as sub-copy, one "New Game" button
- Entrance animation: overlayIn keyframe (spec 7.5), 300ms ease-out
- All buttons use the same outlined gold style as Controls

Final polish pass — fix anything that doesn't meet the acceptance criteria in spec section 12:
- Confirm all 5.3 MOVE action edge cases work: no-op moves don't consume undo, win triggers at tier 11, loss triggers when grid is full with no matches
- Confirm KEEP_GOING sets keepGoing = true and dismisses overlay, play continues
- Confirm best score persists across page reload
- Confirm aria-label on all cells and aria-live on score regions (spec section 10)
- Confirm the themeability contract (spec 12.5): temporarily change TILE_CONFIG to 8 entries and confirm the game still runs correctly with no code changes other than the array

Verify against the full acceptance criteria checklist in spec section 12 before marking complete.
```

---

## Build Order Summary

| Step | Section Built          | Verifiable By                        |
|------|------------------------|--------------------------------------|
| 1    | Scaffold + Theme       | Page loads, correct fonts/colors     |
| 2    | Game Logic             | Console function calls               |
| 3    | State + Context        | Score renders, dispatch works        |
| 4    | Board + Tiles          | Grid renders with 2 emoji tiles      |
| 5    | Input Handling         | Arrow keys and swipe move tiles      |
| 6    | Header + Controls      | Full UI chrome, undo/new game work   |
| 7    | Animations             | Spawn, merge, stagger all fire       |
| 8    | Overlay + Polish       | End-to-end game loop, spec checklist |

---

## Notes for the Implementer

- **Do not skip steps.** Each step's verification gate exists to catch logic bugs before they become UI bugs and UI bugs before they become animation bugs.
- **Run `/specs/Emoji2048-spec.md` through Claude Code's context** at the start of each session with `@specs/Emoji2048-spec.md` if the session is new.
- **Steps 2 and 3 are the hardest.** Invest time getting the pure logic right in step 2 — everything downstream depends on it.
- **The `changed` flag in `applyMove`** is easy to get wrong. Test it explicitly: a move that produces no grid change must not spawn a tile and must not consume the undo slot.