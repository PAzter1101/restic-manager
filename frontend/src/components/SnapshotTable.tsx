import { useState } from 'react'
import { Snapshot } from '../services/auth'

interface SnapshotTableProps {
  snapshots: Snapshot[]
  onSnapshotClick: (snapshot: Snapshot) => void
}

type SortField = 'time' | 'hostname' | 'id'
type SortDirection = 'asc' | 'desc'

export default function SnapshotTable({ snapshots, onSnapshotClick }: SnapshotTableProps) {
  const [sortField, setSortField] = useState<SortField>('time')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedSnapshots = [...snapshots].sort((a, b) => {
    let aValue: string | number
    let bValue: string | number

    switch (sortField) {
      case 'time':
        aValue = new Date(a.time).getTime()
        bValue = new Date(b.time).getTime()
        break
      case 'hostname':
        aValue = a.hostname
        bValue = b.hostname
        break
      case 'id':
        aValue = a.id
        bValue = b.id
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️'
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU')
  }

  if (snapshots.length === 0) {
    return (
      <div className="empty">
        <p>Снапшоты не найдены</p>
      </div>
    )
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')} className="th--sortable">
              ID {getSortIcon('id')}
            </th>
            <th onClick={() => handleSort('time')} className="th--sortable">
              Время {getSortIcon('time')}
            </th>
            <th onClick={() => handleSort('hostname')} className="th--sortable">
              Хост {getSortIcon('hostname')}
            </th>
            <th className="table-cell--tags">Теги</th>
            <th className="table-cell--paths">Пути</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {sortedSnapshots.map((snapshot) => (
            <tr key={snapshot.id}>
              <td className="table-cell--code">
                <code>{snapshot.short_id || snapshot.id.substring(0, 8)}</code>
              </td>
              <td>{formatDate(snapshot.time)}</td>
              <td><strong>{snapshot.hostname}</strong></td>
              <td className="table-cell--tags">
                {snapshot.tags && snapshot.tags.length > 0 ? (
                  <div className="tag-list">
                    {snapshot.tags.map(tag => (
                      <code key={tag}>{tag}</code>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted">-</span>
                )}
              </td>
              <td className="table-cell--paths">
                {snapshot.paths && snapshot.paths.length > 0 ? (
                  <div className="path-list">
                    {snapshot.paths.slice(0, 2).map(path => (
                      <div key={path} className="path-item">{path}</div>
                    ))}
                    {snapshot.paths.length > 2 && (
                      <div className="text-muted">... и еще {snapshot.paths.length - 2}</div>
                    )}
                  </div>
                ) : (
                  <span className="text-muted">-</span>
                )}
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSnapshotClick(snapshot)
                    }}
                    className="btn btn-sm btn-secondary"
                    title="Просмотр файлов"
                  >
                    📁
                  </button>
                  <a
                    href={`/api/download/${snapshot.id}`}
                    className="btn btn-sm btn-primary"
                    title="Скачать снапшот"
                    onClick={(e) => e.stopPropagation()}
                  >
                    ⬇️
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
