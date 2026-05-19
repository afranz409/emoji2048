// TileConfig schema: { emoji, label, bg, glow, text }
//   emoji — single emoji character
//   label — URL-safe slug (used for aria-label)
//   bg    — CSS hex, tile background
//   glow  — CSS hex, box-shadow glow color on merge
//   text  — CSS hex, fallback text color if emoji fails

export const TILE_CONFIG = [
  { emoji: '😶', label: 'blank',      bg: '#2d3561', glow: '#4a5298', text: '#a0a8d0' },
  { emoji: '🙂', label: 'smile',      bg: '#1a6b5a', glow: '#2db88a', text: '#80d4b0' },
  { emoji: '😊', label: 'happy',      bg: '#4a7c20', glow: '#7bc832', text: '#b0e070' },
  { emoji: '😄', label: 'grin',       bg: '#8a6200', glow: '#f0a500', text: '#f8d080' },
  { emoji: '😂', label: 'tears',      bg: '#a04000', glow: '#ff6a00', text: '#ffb070' },
  { emoji: '😍', label: 'hearteyes',  bg: '#8a1a3a', glow: '#f03070', text: '#f890b0' },
  { emoji: '🤩', label: 'starstruck', bg: '#6a0a8a', glow: '#c020f0', text: '#d880f8' },
  { emoji: '😱', label: 'screaming',  bg: '#1a2a6a', glow: '#4060f0', text: '#90a8f8' },
  { emoji: '🤯', label: 'mindblown',  bg: '#6a1a00', glow: '#ff3000', text: '#ff9070' },
  { emoji: '💀', label: 'skull',      bg: '#1a1a1a', glow: '#888888', text: '#cccccc' },
  { emoji: '👻', label: 'ghost',      bg: '#0a2a3a', glow: '#40c0ff', text: '#80d8ff' },
  { emoji: '🌈', label: 'rainbow',    bg: '#1a0a3a', glow: '#ff80ff', text: '#ffb0ff' },
]

export const GAME_TITLE = 'EMOJI 2048'

// Win fires at ghost (2048). Rainbow (4096) is reachable via Keep Going.
export const WIN_TIER = TILE_CONFIG.length - 2
