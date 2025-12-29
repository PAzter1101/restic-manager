export class Paginator {
  constructor(itemsPerPage = 10) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.totalItems = 0;
  }

  setItemsPerPage(count) {
    this.itemsPerPage = count;
    this.currentPage = 1;
  }

  setTotalItems(count) {
    this.totalItems = count;
    if (this.currentPage > this.getTotalPages()) {
      this.currentPage = Math.max(1, this.getTotalPages());
    }
  }

  getTotalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getCurrentPageData(data) {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return data.slice(start, end);
  }

  goToPage(page) {
    const totalPages = this.getTotalPages();
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
      return true;
    }
    return false;
  }

  nextPage() {
    return this.goToPage(this.currentPage + 1);
  }

  prevPage() {
    return this.goToPage(this.currentPage - 1);
  }

  getPageInfo() {
    const totalPages = this.getTotalPages();
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    
    return {
      currentPage: this.currentPage,
      totalPages,
      start,
      end,
      total: this.totalItems,
      hasNext: this.currentPage < totalPages,
      hasPrev: this.currentPage > 1
    };
  }
}
