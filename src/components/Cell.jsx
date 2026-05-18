import Tile from './Tile.jsx'

export default function Cell({ row, col, tier }) {
  return (
    <div
      className="cell"
      role="gridcell"
      aria-label={tier === null ? 'empty' : undefined}
    >
      {tier !== null && <Tile tier={tier} row={row} col={col} />}
    </div>
  )
}
