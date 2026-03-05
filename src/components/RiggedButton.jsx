import { useState } from 'react'
import styles from './WaitingRoom.module.css'

const MESSAGES = [
  '100% legítimo, firmado ante notario 📜',
  'El admin jura por su equipo que no está trucado',
  'Completamente aleatorio... o eso nos han dicho',
  'Los abogados del admin recomiendan no responder esta pregunta',
  'Sí. Pero no puedes demostrarlo.',
  '¿Trucado? ¡Qué barbaridad! (sí)',
  'El algoritmo es infalible. El admin, no tanto.',
  'Técnicamente no es trampa si todos saben que está trucado',
]

export default function RiggedButton() {
  const [message, setMessage] = useState(null)

  function handleClick() {
    const random = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
    setMessage(random)
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className={styles.riggedWrapper}>
      <button className={styles.riggedBtn} onClick={handleClick}>
        ¿Está trucado? 🎰
      </button>
      {message && <p className={styles.riggedMsg}>{message}</p>}
    </div>
  )
}
