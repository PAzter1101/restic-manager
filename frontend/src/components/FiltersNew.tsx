import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface FiltersProps {
  onFilter: (filters: { host?: string; tag?: string }) => void
  loading: boolean
  snapshots: any[]
}

export default function Filters({ onFilter, loading, snapshots }: FiltersProps) {
  const [host, setHost] = useState('')
  const [tag, setTag] = useState('')
  const [showHostDropdown, setShowHostDropdown] = useState(false)
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  
  const hostInputRef = useRef<HTMLInputElement>(null)
  const tagInputRef = useRef<HTMLInputElement>(null)

  // Получаем уникальные хосты и теги из снапшотов
  const uniqueHosts = [...new Set(snapshots.map(s => s.hostname).filter(Boolean))]
  const uniqueTags = [...new Set(snapshots.flatMap(s => s.tags || []).filter(Boolean))]

  const filteredHosts = uniqueHosts.filter(h => 
    h.toLowerCase().includes(host.toLowerCase())
  )
  
  const filteredTags = uniqueTags.filter(t => {
    const currentTags = tag.split(',').map(t => t.trim()).filter(Boolean)
    const lastTag = tag.split(',').pop()?.trim() || ''
    return t.toLowerCase().includes(lastTag.toLowerCase()) && !currentTags.includes(t)
  })

  const updateDropdownPosition = (inputRef: React.RefObject<HTMLInputElement>) => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
  }

  const handleHostFocus = () => {
    setShowHostDropdown(true)
  }

  const handleTagFocus = () => {
    setShowTagDropdown(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter({
      host: host.trim() || undefined,
      tag: tag.trim() || undefined
    })
  }

  const selectHost = (selectedHost: string) => {
    setHost(selectedHost)
    setShowHostDropdown(false)
  }

  const selectTag = (selectedTag: string) => {
    const currentTags = tag.split(',').map(t => t.trim()).filter(Boolean)
    if (currentTags.includes(selectedTag)) {
      // Удаляем тег если он уже выбран
      const newTags = currentTags.filter(t => t !== selectedTag).join(', ')
      setTag(newTags)
    } else {
      // Добавляем новый тег
      const newTags = [...currentTags, selectedTag].join(', ')
      setTag(newTags)
    }
    // Не закрываем dropdown для множественного выбора
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
          <div className="filter-input-container">
            <input
              ref={hostInputRef}
              type="text"
              id="hostFilter"
              value={host}
              onChange={(e) => {
                setHost(e.target.value)
                setShowHostDropdown(true)
              }}
              onFocus={handleHostFocus}
              onBlur={() => setTimeout(() => setShowHostDropdown(false), 200)}
              placeholder="Выберите или введите хост"
              className="filter-input"
            />
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="tagFilter" className="filter-label">
            Тег
          </label>
          <div className="filter-input-container">
            <input
              ref={tagInputRef}
              type="text"
              id="tagFilter"
              value={tag}
              onChange={(e) => {
                setTag(e.target.value)
                setShowTagDropdown(true)
              }}
              onFocus={handleTagFocus}
              onBlur={() => setTimeout(() => setShowTagDropdown(false), 200)}
              placeholder="Выберите теги (через запятую)"
              className="filter-input"
            />
          </div>
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

      {/* Dropdowns через портал */}
      {showHostDropdown && uniqueHosts.length > 0 && createPortal(
        <div 
          className="filter-dropdown"
          style={{
            position: 'fixed',
            top: hostInputRef.current?.getBoundingClientRect().bottom || 0,
            left: hostInputRef.current?.getBoundingClientRect().left || 0,
            width: hostInputRef.current?.getBoundingClientRect().width || 200,
            zIndex: 999999
          }}
        >
          {(host === '' ? uniqueHosts : filteredHosts).slice(0, 10).map(h => (
            <div
              key={h}
              className="filter-dropdown-item"
              onClick={() => selectHost(h)}
            >
              {h}
            </div>
          ))}
        </div>,
        document.body
      )}

      {showTagDropdown && uniqueTags.length > 0 && createPortal(
        <div 
          className="filter-dropdown"
          style={{
            position: 'fixed',
            top: tagInputRef.current?.getBoundingClientRect().bottom || 0,
            left: tagInputRef.current?.getBoundingClientRect().left || 0,
            width: tagInputRef.current?.getBoundingClientRect().width || 200,
            zIndex: 999999
          }}
        >
          {uniqueTags.slice(0, 10).map(t => {
            const currentTags = tag.split(',').map(t => t.trim()).filter(Boolean)
            const isSelected = currentTags.includes(t)
            return (
              <div
                key={t}
                className={`filter-dropdown-item ${isSelected ? 'selected' : ''}`}
                onClick={() => selectTag(t)}
                style={{ 
                  opacity: isSelected ? 0.8 : 1,
                  backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent'
                }}
              >
                {t} {isSelected && '✓'}
              </div>
            )
          })}
        </div>,
        document.body
      )}
    </div>
  )
}
