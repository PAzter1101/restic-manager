import { useState } from 'react'

interface Snapshot {
  hostname: string
  tags?: string[]
}

interface FiltersProps {
  onFilter: (filters: { host?: string; tag?: string }) => void
  loading: boolean
  snapshots: Snapshot[]
}

export default function FiltersSimple({ onFilter, loading, snapshots }: FiltersProps) {
  const [host, setHost] = useState('')
  const [tag, setTag] = useState('')

  // Получаем уникальные хосты и теги из снапшотов
  const uniqueHosts = [...new Set(snapshots.map(s => s.hostname).filter(Boolean))]
  const uniqueTags = [...new Set(snapshots.flatMap(s => s.tags || []).filter(Boolean))]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter({
      host: host.trim() || undefined,
      tag: tag.trim() || undefined
    })
  }

  const clearFilters = () => {
    setHost('')
    setTag('')
    onFilter({})
  }

  return (
    <div className="filters-container">
      <form onSubmit={handleSubmit} className="filters-form">
        <div className="filter-group">
          <label htmlFor="hostFilter" className="filter-label">
            Хост
          </label>
          <select
            id="hostFilter"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="form-input form-select"
          >
            <option value="">Все хосты</option>
            {uniqueHosts.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="tagFilter" className="filter-label">
            Тег
          </label>
          <select
            id="tagFilter"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="form-input form-select"
          >
            <option value="">Все теги</option>
            {uniqueTags.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="filter-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Загрузка...' : 'Применить'}
          </button>
          <button 
            type="button" 
            onClick={clearFilters}
            className="btn btn-secondary"
            disabled={loading}
          >
            Очистить
          </button>
        </div>
      </form>
    </div>
  )
}
