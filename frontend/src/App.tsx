import { useState, useEffect } from 'react'
import Login from './components/Login'
import SnapshotList from './components/SnapshotList'
import { authService } from './services/auth'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    authService.logout()
    setIsAuthenticated(false)
  }

  if (loading) {
    return <div className="loading">Загрузка...</div>
  }

  return (
    <div className="app">
      {isAuthenticated ? (
        <SnapshotList onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App
