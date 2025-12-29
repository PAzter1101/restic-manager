import { useState } from 'react'
import { authService } from '../services/auth'

interface LoginProps {
  onLogin: () => void
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await authService.login(username, password)
      onLogin()
    } catch {
      setError('Неверные учетные данные')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page page--centered">
      <div className="card login-form">
        <div className="card__body">
          <h1>📦 Restic Web Manager</h1>
          <form onSubmit={handleSubmit} className="stack stack--lg">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Имя пользователя
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="form-input"
                placeholder="Введите имя пользователя"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Пароль
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Введите пароль"
              />
            </div>
            
            {error && (
              <div className="alert alert--error" role="alert">
                {error}
              </div>
            )}
            
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
