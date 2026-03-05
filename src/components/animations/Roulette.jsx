import { useState, useEffect, useRef } from 'react'
import styles from './Roulette.module.css'

export default function Roulette({ result, currentReveal, isAdmin, onRevealNext }) {
  const [spinning, setSpinning] = useState(false)
  const prevReveal = useRef(currentReveal)
  const total = result.length

  // Map currentReveal to reverse order (last pick first):
  // Step i reveals pick #(total - i) = result[(total - 1) - i]
  function getPickAt(step) {
    return { pickNumber: total - step, participant: result[(total - 1) - step] }
  }

  // Participants already assigned
  const assignedNames = []
  for (let i = 0; i <= currentReveal; i++) {
    assignedNames.push(getPickAt(i).participant)
  }
  const remaining = result.filter(p => !assignedNames.includes(p))

  // Animate wheel on currentReveal change
  useEffect(() => {
    if (currentReveal > prevReveal.current || (currentReveal === 0 && prevReveal.current === -1)) {
      setSpinning(true)
      setTimeout(() => setSpinning(false), 2000)
    }
    prevReveal.current = currentReveal
  }, [currentReveal])

  const allDone = currentReveal >= total - 1

  // Build history of revealed picks (most recent first)
  const revealedPicks = []
  for (let i = 0; i <= currentReveal; i++) {
    revealedPicks.unshift(getPickAt(i))
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🎡 Ruleta del Sorteo</h2>

      {/* Wheel visual */}
      <div className={`${styles.wheel} ${spinning ? styles.spinning : ''}`}>
        {(remaining.length > 0 ? remaining : result).slice(0, 8).map((name, i) => (
          <div key={name} className={styles.wheelItem} style={{ '--i': i, '--total': Math.min(remaining.length || result.length, 8) }}>
            {name}
          </div>
        ))}
      </div>

      {/* Last result */}
      {currentReveal >= 0 && (
        <div className={styles.lastResult}>
          <span className={styles.pickNum}>Pick #{revealedPicks[0].pickNumber}</span>
          <span className={styles.winner}>{revealedPicks[0].participant}</span>
        </div>
      )}

      {/* History (skip the most recent, it's shown above) */}
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
          {currentReveal === -1 ? '🎡 Girar' : '🎡 Siguiente giro'}
        </button>
      )}

      {allDone && !spinning && (
        <button className={styles.finishBtn} onClick={onRevealNext}>
          🏆 Ver resultados
        </button>
      )}

      {allDone && <div className={styles.done}>¡Sorteo completado!</div>}
    </div>
  )
}
