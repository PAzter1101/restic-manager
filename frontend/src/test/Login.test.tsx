import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../components/Login'

// Мокаем authService
vi.mock('../services/auth', () => ({
  authService: {
    login: vi.fn()
  }
}))

describe('Login Component', () => {
  it('renders login form', () => {
    const mockOnLogin = vi.fn()
    render(<Login onLogin={mockOnLogin} />)
    
    expect(screen.getByLabelText(/имя пользователя/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument()
  })

  it('calls authService.login on form submit', async () => {
    const user = userEvent.setup()
    const mockOnLogin = vi.fn()
    const { authService } = await import('../services/auth')
    
    vi.mocked(authService.login).mockResolvedValue({ access_token: 'token' })
    
    render(<Login onLogin={mockOnLogin} />)
    
    await user.type(screen.getByLabelText(/имя пользователя/i), 'admin')
    await user.type(screen.getByLabelText(/пароль/i), 'password')
    await user.click(screen.getByRole('button', { name: /войти/i }))
    
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('admin', 'password')
      expect(mockOnLogin).toHaveBeenCalled()
    })
  })

  it('shows error message on login failure', async () => {
    const user = userEvent.setup()
    const mockOnLogin = vi.fn()
    const { authService } = await import('../services/auth')
    
    vi.mocked(authService.login).mockRejectedValue(new Error('Login failed'))
    
    render(<Login onLogin={mockOnLogin} />)
    
    await user.type(screen.getByLabelText(/имя пользователя/i), 'wrong')
    await user.type(screen.getByLabelText(/пароль/i), 'wrong')
    await user.click(screen.getByRole('button', { name: /войти/i }))
    
    await waitFor(() => {
      expect(screen.getByText('Неверные учетные данные')).toBeInTheDocument()
    })
  })
})
