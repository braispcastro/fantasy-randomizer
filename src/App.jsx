import { useState } from 'react'
import { useFirebaseDraw } from './hooks/useFirebaseDraw'
import Landing from './components/Landing'
import AdminLogin from './components/AdminLogin'
import AdminPanel from './components/AdminPanel'
import WaitingRoom from './components/WaitingRoom'
import DrawContainer from './components/DrawContainer'
import Results from './components/Results'

export default function App() {
  const [view, setView] = useState('landing') // 'landing' | 'viewer' | 'adminLogin' | 'admin'
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('isAdmin') === 'true')
  const { draw, error, startDraw, revealNext, revealCard, resetDraw, saveConfig } = useFirebaseDraw()

  function handleAdminLogin(password) {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      sessionStorage.setItem('isAdmin', 'true')
      setIsAdmin(true)
      setView('admin')
      return true
    }
    return false
  }

  // Firebase connection error
  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', padding: '2rem', textAlign: 'center' }}>
        <h2>⚠️ Error de conexión</h2>
        <p style={{ color: '#888' }}>{error}</p>
        <button onClick={() => window.location.reload()} style={{ padding: '0.5rem 1rem', background: '#333', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Reintentar
        </button>
      </div>
    )
  }

  // Draw is running or complete — show draw/results to everyone
  if (draw?.status === 'running') {
    return (
      <DrawContainer
        draw={draw}
        isAdmin={isAdmin}
        onRevealNext={revealNext}
        onRevealCard={revealCard}
      />
    )
  }

  if (draw?.status === 'complete') {
    return (
      <Results
        result={draw.result}
        isAdmin={isAdmin}
        onReset={resetDraw}
      />
    )
  }

  // Pre-draw views
  if (view === 'landing') {
    return (
      <Landing
        onViewer={() => setView('viewer')}
        onAdmin={() => setView('adminLogin')}
      />
    )
  }

  if (view === 'adminLogin') {
    return <AdminLogin onLogin={handleAdminLogin} onBack={() => setView('landing')} />
  }

  if (view === 'admin') {
    return (
      <AdminPanel
        draw={draw}
        onSaveConfig={saveConfig}
        onStartDraw={startDraw}
        onReset={resetDraw}
      />
    )
  }

  // view === 'viewer'
  return <WaitingRoom draw={draw} />
}
