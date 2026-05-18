/**
 * Creates a fresh 4×4 grid filled with nulls.
 * @returns {(number|null)[][]}
 */
function createEmptyGrid() {
  return Array.from({ length: 4 }, () => Array(4).fill(null));
}

/**
 * Spawns a new tile on a random empty cell and returns a new grid.
 * Tier 0 is placed 90% of the time; tier 1 is placed 10% of the time.
 * If the grid has no empty cells, returns the grid unchanged.
 *
 * @param {(number|null)[][]} grid
 * @returns {(number|null)[][]}
 */
function spawnTile(grid) {
  const empty = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] === null) {
        empty.push([row, col]);
      }
    }
  }

  if (empty.length === 0) {
    return grid;
  }

  const [row, col] = empty[Math.floor(Math.random() * empty.length)];
  const tier = Math.random() < 0.9 ? 0 : 1;

  return grid.map((r, ri) =>
    ri === row
      ? r.map((cell, ci) => (ci === col ? tier : cell))
      : r.slice()
  );
}

export { createEmptyGrid, spawnTile };
