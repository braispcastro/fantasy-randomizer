import { useState, useRef, useEffect } from 'react'
import styles from './FlippedCards.module.css'

export default function FlippedCards({ result, revealedCards, isAdmin, onRevealCard }) {
  const total = result.length
  const allRevealed = revealedCards.length >= total

  // Which cards are mid-flip animation
  const [flipping, setFlipping] = useState(new Set())
  // Which cards show the front face (name), managed locally for smooth animation
  const [frontCards, setFrontCards] = useState(() => new Set(revealedCards))
  const prevRevealedRef = useRef(new Set(revealedCards))

  // Animate cards revealed externally (other browser / viewer sync)
  useEffect(() => {
    const newCards = revealedCards.filter(i => !prevRevealedRef.current.has(i))
    prevRevealedRef.current = new Set(revealedCards)

    newCards.forEach(i => {
      if (flipping.has(i) || frontCards.has(i)) return
      startFlip(i)
    })
  }, [revealedCards])

  function startFlip(index, callback) {
    setFlipping(prev => new Set([...prev, index]))
    // At the midpoint (card is thinnest): switch face
    setTimeout(() => {
      setFrontCards(prev => new Set([...prev, index]))
      callback?.()
    }, 200)
    // End of animation: remove flipping class
    setTimeout(() => {
      setFlipping(prev => { const s = new Set(prev); s.delete(index); return s })
    }, 400)
  }

  function handleCardClick(index) {
    if (!isAdmin || revealedCards.includes(index) || flipping.has(index)) return
    startFlip(index, () => onRevealCard(index))
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
          const isFlipping = flipping.has(i)
          const isFront = frontCards.has(i)
          const isClickable = isAdmin && !revealedCards.includes(i) && !isFlipping
          const isFirstPick = pickNumber === 1 && isFront

          return (
            <div
              key={i}
              className={`${styles.card} ${isFlipping ? styles.flipping : ''} ${isClickable ? styles.clickable : ''}`}
              onClick={() => isClickable && handleCardClick(i)}
            >
              {isFront ? (
                <div className={`${styles.face} ${styles.front} ${isFirstPick ? styles.firstPick : ''}`}>
                  <span className={styles.pickNum}>Pick #{pickNumber}</span>
                  <span className={styles.name}>{participant}</span>
                  {isFirstPick && <span className={styles.crown}>👑</span>}
                </div>
              ) : (
                <div className={`${styles.face} ${styles.back}`}>
                  <span className={styles.backIcon}>🏈</span>
                  <span className={styles.backNum}>#{pickNumber}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {allRevealed && <div className={styles.done}>¡Todas las cartas reveladas!</div>}
    </div>
  )
}
