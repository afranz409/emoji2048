import { GAME_TITLE } from '../theme.js'
import ScorePanel from './ScorePanel.jsx'
import Controls from './Controls.jsx'

export default function Header() {
  return (
    <header className="header">
      <h1 className="header__title">{GAME_TITLE}</h1>
      <div className="header__right">
        <ScorePanel />
        <Controls />
      </div>
    </header>
  )
}
