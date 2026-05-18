import { useGame } from '../context/GameContext.jsx'

export default function Tile({ tier, row, col }) {
  const { state, tileConfig } = useGame()
  const config = tileConfig[tier]
  const key = `${row},${col}`
  const isNew = state.newCells.has(key)
  const isMerged = state.mergedCells.has(key)

  const classes = ['tile', isNew && 'tile--new', isMerged && 'tile--merged']
    .filter(Boolean).join(' ')

  const style = {
    background: `radial-gradient(circle at center, ${config.glow}33 0%, ${config.bg} 70%)`,
    ...(isMerged ? { '--tile-glow': config.glow } : {}),
  }

  return (
    <div className={classes} style={style} aria-label={config.label}>
      <span className="tile__emoji" aria-hidden="true">{config.emoji}</span>
    </div>
  )
}
