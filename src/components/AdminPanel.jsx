import { useState, useEffect } from 'react'
import { usePresence } from '../hooks/usePresence'
import styles from './AdminPanel.module.css'

const ANIMATION_OPTIONS = [
  { value: 'progressive', label: '🎭 Revelación progresiva', desc: 'Del último al primero, uno a uno' },
  { value: 'roulette', label: '🎡 Ruleta', desc: 'Rueda giratoria por cada pick' },
  { value: 'flipped', label: '🃏 Tarjetas', desc: 'Tarjetas boca abajo a revelar' },
]

export default function AdminPanel({ draw, onSaveConfig, onStartDraw, onReset }) {
  const viewerCount = usePresence()
  const [participantsText, setParticipantsText] = useState('')
  const [animationType, setAnimationType] = useState('progressive')
  const [saved, setSaved] = useState(false)

  // Load existing config if available
  useEffect(() => {
    if (draw?.config?.participants) {
      setParticipantsText(draw.config.participants.join('\n'))
    }
    if (draw?.config?.animationType) {
      setAnimationType(draw.config.animationType)
    }
  }, [])

  function getParticipants() {
    return participantsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
  }

  async function handleSave() {
    const participants = getParticipants()
    if (participants.length < 2) return
    await onSaveConfig(participants, animationType)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleStart() {
    const participants = getParticipants()
    if (participants.length < 2) return
    if (!window.confirm(`¿Iniciar el sorteo con ${participants.length} participantes? Esta acción no se puede deshacer.`)) return
    await onStartDraw(participants, animationType)
  }

  const participants = getParticipants()
  const canStart = participants.length >= 2

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Panel Admin 🔑</h1>
        <span className={styles.viewers}>👥 {viewerCount} conectados</span>
      </div>

      <section className={styles.section}>
        <label className={styles.label}>
          Participantes ({participants.length})
          <span className={styles.hint}>Un nombre por línea</span>
        </label>
        <textarea
          className={styles.textarea}
          value={participantsText}
          onChange={e => setParticipantsText(e.target.value)}
          placeholder={"Brais\nCarlos\nAna\n..."}
          rows={8}
        />
      </section>

      <section className={styles.section}>
        <label className={styles.label}>Estilo de animación</label>
        <div className={styles.animOptions}>
          {ANIMATION_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`${styles.animOption} ${animationType === opt.value ? styles.selected : ''}`}
              onClick={() => setAnimationType(opt.value)}
            >
              <span className={styles.animLabel}>{opt.label}</span>
              <span className={styles.animDesc}>{opt.desc}</span>
            </button>
          ))}
        </div>
      </section>

      <div className={styles.actions}>
        <button className={styles.saveBtn} onClick={handleSave} disabled={!canStart}>
          {saved ? '✓ Guardado' : 'Guardar configuración'}
        </button>
        <button className={styles.startBtn} onClick={handleStart} disabled={!canStart}>
          🚀 Iniciar sorteo
        </button>
        <button className={styles.resetBtn} onClick={onReset}>
          Resetear
        </button>
      </div>
    </div>
  )
}
