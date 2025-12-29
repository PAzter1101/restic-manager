import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FiltersNew from '../components/FiltersNew'

const mockSnapshots = [
  { id: '1', hostname: 'server1', tags: ['backup', 'daily'] },
  { id: '2', hostname: 'server2', tags: ['backup', 'weekly'] },
]

describe('FiltersNew Component', () => {
  it('renders filter inputs', () => {
    const mockOnFilter = vi.fn()
    render(<FiltersNew onFilter={mockOnFilter} loading={false} snapshots={mockSnapshots} />)
    
    expect(screen.getByLabelText(/хост/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/тег/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /применить/i })).toBeInTheDocument()
  })

  it('shows host dropdown on focus', async () => {
    const user = userEvent.setup()
    const mockOnFilter = vi.fn()
    render(<FiltersNew onFilter={mockOnFilter} loading={false} snapshots={mockSnapshots} />)
    
    const hostInput = screen.getByLabelText(/хост/i)
    await user.click(hostInput)
    
    expect(screen.getByText('server1')).toBeInTheDocument()
    expect(screen.getByText('server2')).toBeInTheDocument()
  })

  it('handles multiple tag selection', async () => {
    const user = userEvent.setup()
    const mockOnFilter = vi.fn()
    render(<FiltersNew onFilter={mockOnFilter} loading={false} snapshots={mockSnapshots} />)
    
    const tagInput = screen.getByLabelText(/тег/i)
    await user.click(tagInput)
    
    // Выбираем первый тег
    await user.click(screen.getByText('backup'))
    expect(tagInput).toHaveValue('backup')
    
    // Выбираем второй тег
    await user.click(screen.getByText('daily'))
    expect(tagInput).toHaveValue('backup, daily')
  })

  it('calls onFilter when form is submitted', async () => {
    const user = userEvent.setup()
    const mockOnFilter = vi.fn()
    render(<FiltersNew onFilter={mockOnFilter} loading={false} snapshots={mockSnapshots} />)
    
    await user.type(screen.getByLabelText(/хост/i), 'server1')
    await user.click(screen.getByRole('button', { name: /применить/i }))
    
    expect(mockOnFilter).toHaveBeenCalledWith({ host: 'server1', tag: undefined })
  })
})
