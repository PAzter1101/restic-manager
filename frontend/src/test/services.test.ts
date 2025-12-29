import { describe, it, expect, vi, beforeEach } from 'vitest'

// Мокаем localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
  writable: true,
})

// Мокаем axios полностью
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      },
      post: vi.fn(),
      get: vi.fn()
    })),
    post: vi.fn(),
    get: vi.fn()
  }
}))

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should make login request', async () => {
    // Импортируем после мокинга
    const axios = (await import('axios')).default
    const mockApi = {
      post: vi.fn().mockResolvedValue({ data: { access_token: 'test-token' } }),
      get: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      }
    }
    
    vi.mocked(axios.create).mockReturnValue(mockApi as typeof axios)
    
    const { authService } = await import('../services/auth')
    const result = await authService.login('admin', 'password')
    
    expect(mockApi.post).toHaveBeenCalledWith('/login', {
      username: 'admin',
      password: 'password'
    })
    expect(result).toBe('test-token')
  })
})
