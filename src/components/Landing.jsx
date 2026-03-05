import styles from './Landing.module.css'

export default function Landing({ onViewer, onAdmin }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🏈 Fantasy NFL Draft</h1>
      <p className={styles.subtitle}>Pick Order Randomizer</p>
      <div className={styles.buttons}>
        <button className={styles.viewerBtn} onClick={onViewer}>
          Entrar como Viewer
        </button>
        <button className={styles.adminBtn} onClick={onAdmin}>
          Admin 🔑
        </button>
      </div>
    </div>
  )
}
