import { useState, useEffect, useRef } from 'react'
import styles from './Roulette.module.css'

export default function Roulette({ result, currentReveal, isAdmin, onRevealNext }) {
  const [spinning, setSpinning] = useState(false)
  const [displayName, setDisplayName] = useState('?')
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

      // Only cycle through names not yet revealed (excluding current target)
      const alreadyRevealed = new Set()
      for (let i = 0; i < currentReveal; i++) {
        alreadyRevealed.add(getPickAt(i).participant)
      }
      const pool = result.filter(n => !alreadyRevealed.has(n) && n !== target)
      // Fallback if only one name left (last pick): use all names except target
      const cyclePool = pool.length > 0 ? pool : result.filter(n => n !== target)

      function tick() {
        const elapsed = Date.now() - startTime
        const progress = elapsed / DURATION

        if (progress >= 1) {
          setDisplayName(target)
          setSpinning(false)
          return
        }

        // Quadratic ease-out: starts at 60ms interval, slows to 400ms
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

  const revealedPicks = []
  for (let i = 0; i <= currentReveal; i++) {
    revealedPicks.unshift(getPickAt(i))
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🎰 Ruleta del Sorteo</h2>

      {/* Slot machine drum */}
      <div className={`${styles.drum} ${spinning ? styles.drumSpinning : currentReveal >= 0 ? styles.drumDone : ''}`}>
        <div className={styles.drumName}>{displayName}</div>
      </div>

      {/* Pick number for latest reveal */}
      {currentReveal >= 0 && !spinning && (
        <div className={styles.lastResult}>
          <span className={styles.pickNum}>Pick #{revealedPicks[0].pickNumber}</span>
        </div>
      )}

      {/* History of previous picks */}
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
