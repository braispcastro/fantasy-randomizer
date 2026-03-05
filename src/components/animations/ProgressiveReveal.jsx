import styles from './ProgressiveReveal.module.css'

export default function ProgressiveReveal({ result, currentReveal, isAdmin, onRevealNext }) {
  const total = result.length
  // currentReveal goes 0, 1, 2... but we reveal from last pick to first
  // Step i reveals pick #(total - i) = result[(total - 1) - i]
  const revealedPicks = []
  for (let i = 0; i <= currentReveal; i++) {
    const pickNumber = total - i
    const participant = result[(total - 1) - i]
    revealedPicks.unshift({ pickNumber, participant }) // newest at top
  }

  const allRevealed = currentReveal >= total - 1
  const isFirstPickRevealed = currentReveal === total - 1

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🏈 Sorteo en curso</h2>

      <div className={styles.reveals}>
        {revealedPicks.map(({ pickNumber, participant }, idx) => (
          <div
            key={pickNumber}
            className={`${styles.pick} ${idx === 0 ? styles.latest : ''} ${pickNumber === 1 ? styles.first : ''}`}
          >
            <span className={styles.pickNum}>Pick #{pickNumber}</span>
            <span className={styles.name}>{participant}</span>
          </div>
        ))}
      </div>

      {currentReveal === -1 && (
        <p className={styles.waiting}>Esperando primera revelación...</p>
      )}

      {isAdmin && !allRevealed && (
        <button className={styles.revealBtn} onClick={onRevealNext}>
          {currentReveal === -1 ? '▶ Iniciar revelación' : '▶ Revelar siguiente'}
        </button>
      )}

      {isFirstPickRevealed && (
        <div className={styles.celebration}>🎊 Pick #1 revelado!</div>
      )}
    </div>
  )
}
