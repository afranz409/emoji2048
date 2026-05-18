import { useEffect, useRef } from 'react'
import { useGame } from '../context/GameContext.jsx'

const KEY_MAP = {
  ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
}

export default function InputHandler({ boardRef }) {
  const { dispatch } = useGame()
  const touchStart = useRef(null)

  useEffect(() => {
    function onKeyDown(e) {
      const dir = KEY_MAP[e.key]
      if (dir) { e.preventDefault(); dispatch({ type: 'MOVE', direction: dir }); return }
      if (e.key === 'z' || e.key === 'Z') dispatch({ type: 'UNDO' })
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [dispatch])

  useEffect(() => {
    const el = boardRef?.current
    if (!el) return

    function onTouchStart(e) {
      const t = e.touches[0]
      touchStart.current = { x: t.clientX, y: t.clientY }
    }
    function onTouchEnd(e) {
      if (!touchStart.current) return
      const t = e.changedTouches[0]
      const dx = t.clientX - touchStart.current.x
      const dy = t.clientY - touchStart.current.y
      touchStart.current = null
      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return
      const dir = Math.abs(dx) > Math.abs(dy)
        ? (dx > 0 ? 'right' : 'left')
        : (dy > 0 ? 'down' : 'up')
      dispatch({ type: 'MOVE', direction: dir })
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [boardRef, dispatch])

  return null
}
