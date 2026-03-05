import styles from './FlippedCards.module.css'

export default function FlippedCards({ result, revealedCards, isAdmin, onRevealCard }) {
  const total = result.length
  const allRevealed = revealedCards.length >= total
  // Track which was revealed most recently for the "latest" animation
  const latestIndex = revealedCards.length > 0 ? revealedCards[revealedCards.length - 1] : -1

  function handleCardClick(index) {
    if (!isAdmin) return
    if (revealedCards.includes(index)) return
    onRevealCard(index)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🃏 Tarjetas del Sorteo</h2>
      {isAdmin && !allRevealed && (
        <p className={styles.hint}>Pulsa una tarjeta para revelarla</p>
      )}

      <div className={styles.grid}>
        {result.map((participant, i) => {
          const pickNumber = i + 1
          const isRevealed = revealedCards.includes(i)
          const isLatest = i === latestIndex
          const isFirst = pickNumber === 1 && isRevealed
          const isClickable = isAdmin && !isRevealed && !allRevealed

          return (
            <div
              key={i}
              className={`${styles.cardWrapper} ${isLatest ? styles.latest : ''}`}
              onClick={() => isClickable && handleCardClick(i)}
            >
              <div className={`${styles.card} ${isRevealed ? styles.flipped : ''} ${isClickable ? styles.clickable : ''}`}>
                <div className={styles.cardBack}>
                  <span className={styles.cardBackText}>🏈</span>
                  <span className={styles.cardBackNum}>#{pickNumber}</span>
                </div>
                <div className={`${styles.cardFront} ${isFirst ? styles.firstPick : ''}`}>
                  <span className={styles.cardPickNum}>Pick #{pickNumber}</span>
                  <span className={styles.cardName}>{participant}</span>
                  {isFirst && <span className={styles.crown}>👑</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {allRevealed && <div className={styles.done}>¡Todas las cartas reveladas!</div>}
    </div>
  )
}
