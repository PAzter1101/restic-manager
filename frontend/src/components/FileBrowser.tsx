import { useState, useEffect } from 'react'
import { Snapshot, SnapshotFile, snapshotService } from '../services/auth'

interface FileBrowserProps {
  snapshot: Snapshot
  onClose: () => void
}

export default function FileBrowser({ snapshot, onClose }: FileBrowserProps) {
  const [files, setFiles] = useState<SnapshotFile[]>([])
  const [currentPath, setCurrentPath] = useState('/')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadFiles(currentPath)
  }, [currentPath])

  const loadFiles = async (path: string) => {
    setLoading(true)
    setError('')
    try {
      const response = await snapshotService.getSnapshotFiles(snapshot.id, path)
      const fileList = response.files || []
      setFiles(fileList)
    } catch (err) {
      setError('Ошибка загрузки файлов')
      setFiles([])
    } finally {
      setLoading(false)
    }
  }

  const handleFileClick = (file: SnapshotFile) => {
    if (file.type === 'dir') {
      setCurrentPath(file.path)
    } else {
      const url = snapshotService.getDownloadUrl(snapshot.id, file.path)
      window.open(url, '_blank')
    }
  }

  const handleBackClick = () => {
    if (currentPath === '/') return
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/'
    setCurrentPath(parentPath)
  }

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-'
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('ru-RU')
  }

  return (
    <div className="file-browser-overlay">
      <div className="modal file-browser">
        <div className="modal-header">
          <h3 className="modal-title">
            📁 {snapshot.hostname} - {snapshot.id.substring(0, 8)}
          </h3>
          <button onClick={onClose} className="btn btn-close" aria-label="Закрыть">
            ✕
          </button>
        </div>
        
        <div className="file-browser-path">
          <button 
            onClick={handleBackClick} 
            disabled={currentPath === '/'}
            className="btn btn-sm btn-secondary"
          >
            ← Назад
          </button>
          <span className="current-path">{currentPath}</span>
        </div>

        <div className="modal-body file-browser-content">
          {loading ? (
            <div className="loading">
              <div className="spinner" />
              <p>Загрузка файлов...</p>
            </div>
          ) : error ? (
            <div className="alert alert--error">{error}</div>
          ) : (
            <div className="table-container">
              <table className="table file-table">
                <thead>
                  <tr>
                    <th>Имя</th>
                    <th className="table-cell--numeric">Размер</th>
                    <th>Изменен</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr
                      key={file.path}
                      onClick={() => handleFileClick(file)}
                      className="file-row tr--clickable"
                    >
                      <td>
                        <span className="file-icon">
                          {file.type === 'dir' ? '📁' : '📄'}
                        </span>
                        {file.name}
                      </td>
                      <td className="table-cell--numeric">{formatSize(file.size)}</td>
                      <td>{formatDate(file.mtime)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
