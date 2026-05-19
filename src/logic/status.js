/**
 * Points earned when a merge produces the given tier.
 * @param {number} tier - the resulting tier after merging
 * @returns {number}
 */
function scoreForMerge(tier) {
  return Math.pow(2, tier + 1);
}

/**
 * Returns true if any cell has reached the final tier (win condition).
 * Never hardcodes tier count — always derives it from tileConfig.length.
 *
 * @param {(number|null)[][]} grid
 * @param {object[]} tileConfig
 * @returns {boolean}
 */
function checkWon(grid, winTier) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === winTier) return true;
    }
  }
  return false;
}

/**
 * Returns true when the player has no valid moves remaining:
 *   1. No empty cells exist, AND
 *   2. No two adjacent (horizontal or vertical) cells share the same tier.
 *
 * @param {(number|null)[][]} grid
 * @returns {boolean}
 */
function checkLost(grid) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];

      // Any null cell means the board is not full — not lost
      if (cell === null) return false;

      // Check right neighbour
      if (col < grid[row].length - 1 && grid[row][col + 1] === cell) return false;

      // Check bottom neighbour
      if (row < grid.length - 1 && grid[row + 1][col] === cell) return false;
    }
  }
  return true;
}

export { scoreForMerge, checkWon, checkLost };
