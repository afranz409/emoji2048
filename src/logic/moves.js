import { scoreForMerge } from "./status.js";

// Rotation helpers
//
// Clockwise 90°:  result[col][3 - row] = grid[row][col]
//   • The top row of the input becomes the right column of the output.
//   • Used to normalize "down": bottom column slides left after rotation.
//
// Counter-clockwise 90°:  result[3 - col][row] = grid[row][col]
//   • The top row of the input becomes the left column of the output.
//   • Used to normalize "up": top column slides left after rotation.
//
// 180°: clockwise applied twice.
//   • Used to normalize "right": rightmost elements become leftmost.

function rotateClockwise(grid) {
  const result = Array.from({ length: 4 }, () => Array(4).fill(null));
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      result[col][3 - row] = grid[row][col];
    }
  }
  return result;
}

function rotateCounterClockwise(grid) {
  const result = Array.from({ length: 4 }, () => Array(4).fill(null));
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      result[3 - col][row] = grid[row][col];
    }
  }
  return result;
}

function rotate180(grid) {
  return rotateClockwise(rotateClockwise(grid));
}

/**
 * Slides a single row of 4 cells to the left, merging equal adjacent tiles.
 *
 * @param {(number|null)[]} row          - 4-element row
 * @param {object[]}        tileConfig   - TILE_CONFIG array (used for length cap)
 * @returns {{ row: (number|null)[], score: number, merges: number[] }}
 *   row    — resulting row (length 4, nulls padded on the right)
 *   score  — points earned from merges in this row
 *   merges — output column indices where a merge occurred
 */
function slideRow(row, tileConfig) {
  const maxTier = tileConfig.length - 1;

  // Step 1: compact — remove nulls
  const vals = row.filter((v) => v !== null);

  let score = 0;
  const merges = [];
  const consumed = Array(vals.length).fill(false);

  // Step 2: merge left to right
  for (let i = 0; i < vals.length - 1; i++) {
    if (consumed[i]) continue;
    if (vals[i] === vals[i + 1] && !consumed[i + 1]) {
      const newTier = Math.min(vals[i] + 1, maxTier);
      vals[i] = newTier;
      consumed[i + 1] = true;
      score += scoreForMerge(newTier);
      merges.push(i); // pre-filter index; translated to output position below
    }
  }

  // Step 3: filter consumed entries, collect the surviving values
  const result = vals.filter((_, i) => !consumed[i]);

  // Each prior merge consumed exactly one element, shifting subsequent output
  // indices left by 1, so output position = original index − merge rank.
  const outputMerges = merges.map((pos, k) => pos - k);

  // Step 4: pad to length 4 with nulls on the right
  while (result.length < 4) result.push(null);

  return { row: result, score, merges: outputMerges };
}

/**
 * Applies a move in the given direction and returns the new game state slice.
 *
 * @param {(number|null)[][]} grid
 * @param {"left"|"right"|"up"|"down"} direction
 * @param {object[]} tileConfig
 * @returns {{ grid: (number|null)[][], score: number, mergedCells: [number,number][], changed: boolean }}
 */
function applyMove(grid, direction, tileConfig) {
  // Step 1: rotate so the target direction becomes "slide left".
  //
  // "up"   → rotateCounterClockwise: top row becomes the left column of each
  //           rotated row, so sliding left == sliding up in the original.
  // "down" → rotateClockwise: bottom row becomes the left column of each
  //           rotated row, so sliding left == sliding down in the original.
  // "right"→ rotate180: right column becomes left.
  // "left" → no rotation needed.
  let rotated;
  if (direction === "left") {
    rotated = grid.map((r) => r.slice());
  } else if (direction === "right") {
    rotated = rotate180(grid);
  } else if (direction === "up") {
    rotated = rotateCounterClockwise(grid);
  } else {
    // down
    rotated = rotateClockwise(grid);
  }

  // Step 2: slide each row left
  let totalScore = 0;
  const mergedInRotated = [];
  const slidRows = rotated.map((row, rowIdx) => {
    const result = slideRow(row, tileConfig);
    totalScore += result.score;
    for (const col of result.merges) {
      mergedInRotated.push([rowIdx, col]);
    }
    return result.row;
  });

  // Step 3: rotate back to original orientation (inverse of step 1)
  let finalGrid;
  if (direction === "left") {
    finalGrid = slidRows;
  } else if (direction === "right") {
    finalGrid = rotate180(slidRows);
  } else if (direction === "up") {
    // inverse of rotateCounterClockwise is rotateClockwise
    finalGrid = rotateClockwise(slidRows);
  } else {
    // inverse of rotateClockwise is rotateCounterClockwise
    finalGrid = rotateCounterClockwise(slidRows);
  }

  // Step 4: map merged positions back to original grid coordinates.
  //
  // rotateCounterClockwise: result[3-col][row] = grid[row][col]
  //   → rotated[r][c] came from original[c][3-r]   (up case)
  //
  // rotateClockwise: result[col][3-row] = grid[row][col]
  //   → rotated[r][c] came from original[3-c][r]   (down case)
  //
  // rotate180: rotated[r][c] came from original[3-r][3-c]  (right case)
  const mergedCells = mergedInRotated.map(([r, c]) => {
    if (direction === "left") {
      return [r, c];
    } else if (direction === "right") {
      return [3 - r, 3 - c];
    } else if (direction === "up") {
      // rotateCounterClockwise applied → original position is [c][3-r]
      return [c, 3 - r];
    } else {
      // down: rotateClockwise applied → original position is [3-c][r]
      return [3 - c, r];
    }
  });

  // Step 5: determine if anything changed
  let changed = false;
  outer: for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (finalGrid[row][col] !== grid[row][col]) {
        changed = true;
        break outer;
      }
    }
  }

  return { grid: finalGrid, score: totalScore, mergedCells, changed };
}

export { slideRow, applyMove, rotateClockwise, rotateCounterClockwise, rotate180 };
