export class PaginationRenderer {
  constructor(containerId, onPageChange, onPageSizeChange) {
    this.container = document.getElementById(containerId);
    this.onPageChange = onPageChange;
    this.onPageSizeChange = onPageSizeChange;
  }

  render(pageInfo) {
    if (pageInfo.totalPages <= 1) {
      this.container.innerHTML = '';
      return;
    }

    const pages = this._getPageNumbers(pageInfo);
    
    this.container.innerHTML = `
      <div class="pagination-container">
        <div class="pagination-info">
          Показано ${pageInfo.start}-${pageInfo.end} из ${pageInfo.total}
        </div>
        
        <div class="pagination-controls">
          <select class="page-size-select" onchange="window.changePageSize(this.value)">
            <option value="10" ${pageInfo.total <= 10 ? '' : ''}>10 на странице</option>
            <option value="25" ${pageInfo.total <= 25 ? '' : ''}>25 на странице</option>
            <option value="50" ${pageInfo.total <= 50 ? '' : ''}>50 на странице</option>
            <option value="100">100 на странице</option>
          </select>
          
          <div class="pagination-buttons">
            <button class="btn btn-sm" ${!pageInfo.hasPrev ? 'disabled' : ''} 
                    onclick="window.goToPage(${pageInfo.currentPage - 1})">
              ← Назад
            </button>
            
            ${pages.map(page => 
              page === '...' 
                ? '<span class="pagination-dots">...</span>'
                : `<button class="btn btn-sm ${page === pageInfo.currentPage ? 'btn-primary' : ''}" 
                           onclick="window.goToPage(${page})">${page}</button>`
            ).join('')}
            
            <button class="btn btn-sm" ${!pageInfo.hasNext ? 'disabled' : ''} 
                    onclick="window.goToPage(${pageInfo.currentPage + 1})">
              Вперед →
            </button>
          </div>
        </div>
      </div>
    `;
  }

  _getPageNumbers(pageInfo) {
    const { currentPage, totalPages } = pageInfo;
    const pages = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 4) {
        pages.push('...');
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 3) {
        pages.push('...');
      }
      
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  }
}
