import { useEffect, useState } from 'react'
import { ref, onValue, set, update } from 'firebase/database'
import { db } from '../firebase'
import { shuffle } from '../utils/shuffle'

const DRAW_REF = 'draw'

export function useFirebaseDraw() {
  const [draw, setDraw] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const drawRef = ref(db, DRAW_REF)
    const unsubscribe = onValue(
      drawRef,
      (snapshot) => {
        setDraw(snapshot.val())
        setError(null)
      },
      (err) => {
        setError('No se pudo conectar con Firebase. Revisa tu conexión.')
        console.error('Firebase error:', err)
      }
    )
    return () => unsubscribe()
  }, [])

  async function startDraw(participants, animationType) {
    const result = shuffle(participants)
    await set(ref(db, DRAW_REF), {
      status: 'running',
      config: { animationType, participants },
      result,
      currentReveal: -1,
      revealedCards: [],
    })
  }

  // Used by Progressive Reveal and Roulette (sequential reveal, last-to-first)
  async function revealNext() {
    const next = (draw?.currentReveal ?? -1) + 1
    const total = draw?.result?.length ?? 0
    if (next >= total - 1) {
      // Last reveal: set currentReveal and mark complete in one update
      await update(ref(db, DRAW_REF), { status: 'complete', currentReveal: total - 1 })
    } else {
      await update(ref(db, DRAW_REF), { currentReveal: next })
    }
  }

  // Used by Flipped Cards (admin clicks any card in any order)
  async function revealCard(cardIndex) {
    const currentRevealed = draw?.revealedCards ?? []
    if (currentRevealed.includes(cardIndex)) return
    const newRevealed = [...currentRevealed, cardIndex]
    const total = draw?.result?.length ?? 0
    if (newRevealed.length >= total) {
      await update(ref(db, DRAW_REF), { revealedCards: newRevealed, status: 'complete' })
    } else {
      await update(ref(db, DRAW_REF), { revealedCards: newRevealed })
    }
  }

  async function resetDraw() {
    await set(ref(db, DRAW_REF), {
      status: 'waiting', config: null, result: null,
      currentReveal: -1, revealedCards: [],
    })
  }

  async function saveConfig(participants, animationType) {
    await update(ref(db, DRAW_REF), {
      status: 'waiting',
      config: { animationType, participants },
    })
  }

  return { draw, error, startDraw, revealNext, revealCard, resetDraw, saveConfig }
}
