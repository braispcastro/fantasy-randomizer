import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import styles from './Results.module.css'

export default function Results({ result, isAdmin, onReset }) {
  // Fire confetti on mount
  useEffect(() => {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } })
  }, [])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🏆 Resultado Final</h1>

      <div className={styles.list}>
        {result.map((participant, i) => {
          const pickNumber = i + 1
          const isFirst = pickNumber === 1
          const isLast = pickNumber === result.length

          return (
            <div
              key={i}
              className={`${styles.pick} ${isFirst ? styles.first : ''} ${isLast ? styles.last : ''}`}
            >
              <span className={styles.pickNum}>
                {isFirst ? '👑' : isLast ? '🪦' : `#${pickNumber}`}
              </span>
              <span className={styles.name}>{participant}</span>
              {isFirst && <span className={styles.badge}>Pick #1</span>}
              {isLast && <span className={styles.badgeLast}>¡Suerte! 💀</span>}
            </div>
          )
        })}
      </div>

      {isAdmin && (
        <button className={styles.resetBtn} onClick={onReset}>
          🔄 Nuevo sorteo
        </button>
      )}
    </div>
  )
}
