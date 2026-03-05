import { usePresence } from '../hooks/usePresence'
import RiggedButton from './RiggedButton'
import styles from './WaitingRoom.module.css'

export default function WaitingRoom({ draw }) {
  const viewerCount = usePresence()
  const participants = draw?.config?.participants ?? []

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🏈 Fantasy NFL Draft</h1>
      <p className={styles.viewers}>👥 {viewerCount} {viewerCount === 1 ? 'viewer' : 'viewers'} conectados</p>

      <div className={styles.status}>
        {participants.length > 0 ? (
          <>
            <h2 className={styles.sectionTitle}>Participantes</h2>
            <ul className={styles.list}>
              {participants.map((name, i) => (
                <li key={i} className={styles.participant}>{name}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className={styles.waiting}>Esperando al admin para configurar el sorteo...</p>
        )}
      </div>

      <RiggedButton />
    </div>
  )
}
