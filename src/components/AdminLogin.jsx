import { useState } from 'react'
import styles from './AdminLogin.module.css'

export default function AdminLogin({ onLogin, onBack }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const success = onLogin(password)
    if (!success) {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={onBack}>← Volver</button>
      <h2>Acceso Admin</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false) }}
          autoFocus
          className={error ? styles.inputError : styles.input}
        />
        {error && <p className={styles.error}>Contraseña incorrecta</p>}
        <button type="submit" className={styles.submit}>Entrar</button>
      </form>
    </div>
  )
}
