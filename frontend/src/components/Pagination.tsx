interface PaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange
}: PaginationProps) {
  const renderPageButtons = () => {
    const buttons = []
    const maxVisible = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    if (startPage > 1) {
      buttons.push(
        <button key={1} onClick={() => onPageChange(1)} className="btn btn-sm">1</button>
      )
      if (startPage > 2) {
        buttons.push(<span key="dots1" className="pagination-dots">...</span>)
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`btn btn-sm ${i === currentPage ? 'btn-primary' : ''}`}
        >
          {i}
        </button>
      )
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="dots2" className="pagination-dots">...</span>)
      }
      buttons.push(
        <button key={totalPages} onClick={() => onPageChange(totalPages)} className="btn btn-sm">
          {totalPages}
        </button>
      )
    }

    return buttons
  }

  if (totalPages <= 1) return null

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Показано {Math.min(pageSize, totalItems)} из {totalItems} записей
      </div>
      
      <div className="pagination-controls">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="page-size-select"
        >
          <option value={10}>10 на странице</option>
          <option value={25}>25 на странице</option>
          <option value={50}>50 на странице</option>
          <option value={100}>100 на странице</option>
        </select>
        
        <div className="pagination-buttons">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="btn btn-sm"
          >
            ←
          </button>
          {renderPageButtons()}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="btn btn-sm"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
