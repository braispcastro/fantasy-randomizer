import { useEffect, useState } from 'react'
import { ref, onValue, set, remove, onDisconnect } from 'firebase/database'
import { db } from '../firebase'

const sessionId = Math.random().toString(36).slice(2, 10)

export function usePresence() {
  const [viewerCount, setViewerCount] = useState(0)

  useEffect(() => {
    const presenceRef = ref(db, `presence/${sessionId}`)
    const allPresenceRef = ref(db, 'presence')
    const connectedRef = ref(db, '.info/connected')

    // Use Firebase's official presence pattern to avoid race conditions:
    // 1. Listen for connection state
    // 2. On connect: first register cleanup (onDisconnect), then write presence
    const unsubConnect = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        onDisconnect(presenceRef).remove()
        set(presenceRef, true)
      }
    })

    // Listen for total count
    const unsubCount = onValue(allPresenceRef, (snapshot) => {
      const val = snapshot.val()
      setViewerCount(val ? Object.keys(val).length : 0)
    })

    return () => {
      unsubConnect()
      unsubCount()
      remove(presenceRef)
    }
  }, [])

  return viewerCount
}
