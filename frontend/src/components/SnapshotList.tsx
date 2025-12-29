import { useState, useEffect } from 'react'
import { Snapshot, snapshotService } from '../services/auth'
import FiltersNew from './FiltersNew'
import SnapshotTable from './SnapshotTable'
import Pagination from './Pagination'
import FileBrowser from './FileBrowser'

interface SnapshotListProps {
  onLogout: () => void
}

interface SnapshotResponse {
  snapshots: Snapshot[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export default function SnapshotList({ onLogout }: SnapshotListProps) {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSnapshot, setSelectedSnapshot] = useState<Snapshot | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  
  // Filter state
  const [filters, setFilters] = useState<{ host?: string; tag?: string }>({})

  useEffect(() => {
    loadSnapshots()
  }, [currentPage, pageSize, filters])

  const loadSnapshots = async () => {
    setLoading(true)
    setError('')
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        ...filters
      }
      const response: SnapshotResponse = await snapshotService.getSnapshots(params)
      setSnapshots(response.snapshots || [])
      setTotalPages(response.total_pages || 1)
      setTotalItems(response.total || 0)
    } catch (err) {
      setError('Ошибка загрузки снапшотов')
      setSnapshots([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (newFilters: { host?: string; tag?: string }) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  const handleSnapshotClick = (snapshot: Snapshot) => {
    setSelectedSnapshot(snapshot)
  }

  const handleCloseBrowser = () => {
    setSelectedSnapshot(null)
  }

  return (
    <div className="snapshot-container">
      <header className="header">
        <div className="header__content">
          <h1 className="header__title">📦 Restic Web Manager</h1>
          <div className="header__actions">
            <button onClick={onLogout} className="btn btn-danger">
              Выйти
            </button>
          </div>
        </div>
      </header>
      
      <div className="container">
        <div className="glass">
          <FiltersNew 
            onFilter={handleFilter} 
            loading={loading} 
            snapshots={snapshots}
          />
        </div>
        
        <div className="glass">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Загрузка снапшотов...</p>
            </div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <>
              <SnapshotTable 
                snapshots={snapshots} 
                onSnapshotClick={handleSnapshotClick}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </>
          )}
        </div>
      </div>

      {selectedSnapshot && (
        <FileBrowser
          snapshot={selectedSnapshot}
          onClose={handleCloseBrowser}
        />
      )}
    </div>
  )
}
