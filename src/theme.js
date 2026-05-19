// TileConfig schema: { emoji, label, bg, glow, text }
//   emoji — single emoji character
//   label — URL-safe slug (used for aria-label)
//   bg    — CSS hex, tile background
//   glow  — CSS hex, box-shadow glow color on merge
//   text  — CSS hex, fallback text color if emoji fails

export const TILE_CONFIG = [
  { emoji: '😶', label: 'blank',      bg: '#1a2a3a', glow: '#2a4a6a', text: '#a0a8d0' },
  { emoji: '🙂', label: 'smile',      bg: '#1a3a4a', glow: '#2a6a7a', text: '#80d4b0' },
  { emoji: '😊', label: 'happy',      bg: '#1a4a3a', glow: '#2a7a5a', text: '#b0e070' },
  { emoji: '😄', label: 'grin',       bg: '#4a4a10', glow: '#9a9a20', text: '#f8d080' },
  { emoji: '😂', label: 'tears',      bg: '#5a3a0a', glow: '#c07a20', text: '#ffb070' },
  { emoji: '😍', label: 'hearteyes',  bg: '#6a2a0a', glow: '#d05a18', text: '#f890b0' },
  { emoji: '🤩', label: 'starstruck', bg: '#6a1a0a', glow: '#e03a10', text: '#d880f8' },
  { emoji: '😱', label: 'screaming',  bg: '#6a0a1a', glow: '#d02040', text: '#90a8f8' },
  { emoji: '🤯', label: 'mindblown',  bg: '#5a0a3a', glow: '#c01060', text: '#ff9070' },
  { emoji: '💀', label: 'skull',      bg: '#0f0f0f', glow: '#444444', text: '#cccccc' },
  { emoji: '👻', label: 'ghost',      bg: '#0a1a2a', glow: '#80d0ff', text: '#80d8ff' },
  { emoji: '🌈', label: 'rainbow',    bg: '#1a0a2a', glow: '#ff80ff', text: '#ffb0ff' },
]

export const GAME_TITLE = 'EMOJI 2048'

// Win fires at ghost (2048). Rainbow (4096) is reachable via Keep Going.
export const WIN_TIER = TILE_CONFIG.length - 2
