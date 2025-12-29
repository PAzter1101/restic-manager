import { useState, useEffect, useRef } from 'react'

interface FiltersProps {
  onFilter: (filters: { host?: string; tag?: string }) => void
  loading: boolean
  hosts?: string[]
  tags?: string[]
}

export default function Filters({ onFilter, loading, hosts = [], tags = [] }: FiltersProps) {
  const [host, setHost] = useState('')
  const [tag, setTag] = useState('')
  const [showHostDropdown, setShowHostDropdown] = useState(false)
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  
  const hostRef = useRef<HTMLDivElement>(null)
  const tagRef = useRef<HTMLDivElement>(null)

  const filteredHosts = hosts.filter(h => 
    h.toLowerCase().includes(host.toLowerCase())
  ).slice(0, 10)
  
  const filteredTags = tags.filter(t => 
    t.toLowerCase().includes(tag.toLowerCase())
  ).slice(0, 10)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (hostRef.current && !hostRef.current.contains(event.target as Node)) {
        setShowHostDropdown(false)
      }
      if (tagRef.current && !tagRef.current.contains(event.target as Node)) {
        setShowTagDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter({
      host: host.trim() || undefined,
      tag: tag.trim() || undefined
    })
  }

  return (
    <div className="filters-container">
      <form onSubmit={handleSubmit} className="filters-form">
        <div className="filter-group" ref={hostRef}>
          <label htmlFor="hostFilter" className="filter-label">Хост</label>
          <div className="filter-input-container">
            <input
              type="text"
              id="hostFilter"
              value={host}
              onChange={(e) => {
                setHost(e.target.value)
                setShowHostDropdown(true)
              }}
              onFocus={() => setShowHostDropdown(true)}
              placeholder="Фильтр по хосту"
              className="filter-input"
            />
            {showHostDropdown && filteredHosts.length > 0 && (
              <div className="filter-dropdown">
                {filteredHosts.map((h, index) => (
                  <div
                    key={index}
                    className="filter-dropdown-item"
                    onClick={() => {
                      setHost(h)
                      setShowHostDropdown(false)
                    }}
                  >
                    {h}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="filter-group" ref={tagRef}>
          <label htmlFor="tagFilter" className="filter-label">Тег</label>
          <div className="filter-input-container">
            <input
              type="text"
              id="tagFilter"
              value={tag}
              onChange={(e) => {
                setTag(e.target.value)
                setShowTagDropdown(true)
              }}
              onFocus={() => setShowTagDropdown(true)}
              placeholder="Фильтр по тегу"
              className="filter-input"
            />
            {showTagDropdown && filteredTags.length > 0 && (
              <div className="filter-dropdown">
                {filteredTags.map((t, index) => (
                  <div
                    key={index}
                    className="filter-dropdown-item"
                    onClick={() => {
                      setTag(t)
                      setShowTagDropdown(false)
                    }}
                  >
                    {t}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="filter-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Загрузка...' : 'Загрузить'}
          </button>
        </div>
      </form>
    </div>
  )
}
