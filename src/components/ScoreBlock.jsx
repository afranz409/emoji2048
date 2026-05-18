import { useRef, useEffect } from 'react'

export default function ScoreBlock({ label, score }) {
  const valueRef = useRef(null)
  const prevScore = useRef(score)

  useEffect(() => {
    if (score !== prevScore.current && valueRef.current) {
      valueRef.current.classList.remove('score--nudge')
      void valueRef.current.offsetWidth
      valueRef.current.classList.add('score--nudge')
      const t = setTimeout(() => valueRef.current?.classList.remove('score--nudge'), 200)
      prevScore.current = score
      return () => clearTimeout(t)
    }
    prevScore.current = score
  }, [score])

  return (
    <div className="score-block">
      <span className="score-block__label">{label}</span>
      <span ref={valueRef} className="score-block__value" aria-live="polite" aria-atomic="true">
        {score}
      </span>
    </div>
  )
}
