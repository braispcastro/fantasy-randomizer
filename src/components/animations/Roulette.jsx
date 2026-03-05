import { useState, useEffect, useRef } from 'react'
import styles from './Roulette.module.css'

export default function Roulette({ result, currentReveal, isAdmin, onRevealNext }) {
  const [spinning, setSpinning] = useState(false)
  const [displayName, setDisplayName] = useState('?')
  // Local reveal index: only advances after animation finishes (no spoilers in history)
  const [shownReveal, setShownReveal] = useState(currentReveal)
  const prevReveal = useRef(currentReveal)
  const timeoutRef = useRef(null)
  const total = result.length

  function getPickAt(step) {
    return { pickNumber: total - step, participant: result[(total - 1) - step] }
  }

  useEffect(() => {
    const isNewReveal =
      currentReveal > prevReveal.current ||
      (currentReveal === 0 && prevReveal.current === -1)

    if (isNewReveal && currentReveal >= 0) {
      const target = getPickAt(currentReveal).participant
      setSpinning(true)

      const DURATION = 2800
      const startTime = Date.now()
      let step = 0

      // Cycle through all names not yet shown — INCLUDING target for suspense
      const alreadyShown = new Set()
      for (let i = 0; i < currentReveal; i++) {
        alreadyShown.add(getPickAt(i).participant)
      }
      const cyclePool = result.filter(n => !alreadyShown.has(n))

      function tick() {
        const elapsed = Date.now() - startTime
        const progress = elapsed / DURATION

        if (progress >= 1) {
          setDisplayName(target)
          setSpinning(false)
          setShownReveal(currentReveal) // update history only now
          return
        }

        const delay = 60 + 340 * Math.pow(progress, 2)
        setDisplayName(cyclePool[step % cyclePool.length])
        step++
        timeoutRef.current = setTimeout(tick, delay)
      }

      tick()
    }

    prevReveal.current = currentReveal
    return () => clearTimeout(timeoutRef.current)
  }, [currentReveal])

  const allDone = currentReveal >= total - 1

  // History based on shownReveal, not currentReveal — no spoilers while spinning
  const revealedPicks = []
  for (let i = 0; i <= shownReveal; i++) {
    revealedPicks.unshift(getPickAt(i))
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🎰 Ruleta del Sorteo</h2>

      <div className={`${styles.drum} ${spinning ? styles.drumSpinning : shownReveal >= 0 ? styles.drumDone : ''}`}>
        <div className={styles.drumName}>{displayName}</div>
      </div>

      {shownReveal >= 0 && !spinning && (
        <div className={styles.lastResult}>
          <span className={styles.pickNum}>Pick #{revealedPicks[0].pickNumber}</span>
        </div>
      )}

      {revealedPicks.length > 1 && (
        <div className={styles.history}>
          {revealedPicks.slice(1).map(({ pickNumber, participant }) => (
            <div key={pickNumber} className={styles.historyItem}>
              Pick #{pickNumber} — {participant}
            </div>
          ))}
        </div>
      )}

      {isAdmin && !allDone && !spinning && (
        <button className={styles.spinBtn} onClick={onRevealNext}>
          {currentReveal === -1 ? '🎰 Girar' : '🎰 Siguiente giro'}
        </button>
      )}

      {allDone && !spinning && (
        <button className={styles.finishBtn} onClick={onRevealNext}>
          🏆 Ver resultados
        </button>
      )}
    </div>
  )
}
