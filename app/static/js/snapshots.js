import { Sorter } from './utils/sorter.js';
import { Paginator } from './utils/paginator.js';
import { TableRenderer } from './components/table-renderer.js';
import { PaginationRenderer } from './components/pagination-renderer.js';
import { SizeLoader } from './services/size-loader.js';

class SnapshotManager {
  constructor() {
    this.api = new ApiClient();
    this.snapshots = [];
    this.filteredSnapshots = [];
    this.sorter = new Sorter();
    this.paginator = new Paginator(10);
    this.renderer = new TableRenderer('snapshots');
    this.paginationRenderer = new PaginationRenderer('pagination');
    this.sizeLoader = new SizeLoader(this.api);
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadSnapshots();
  }

  bindEvents() {
    document.getElementById('loadBtn')?.addEventListener('click', () => this.loadSnapshots());
    document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
  }

  async loadSnapshots() {
    this.renderer.showLoading();

    try {
      const filters = {
        host: document.getElementById('hostFilter')?.value || '',
        tag: document.getElementById('tagFilter')?.value || ''
      };
      
      this.snapshots = await this.api.getSnapshots(filters);
      this.updateDisplay();
      this.loadSizesAsync();
    } catch (error) {
      this.renderer.showError(error.message);
    }
  }

  sortSnapshots(column) {
    this.filteredSnapshots = this.sorter.sort(this.filteredSnapshots, column);
    this.paginator.currentPage = 1;
    this.renderCurrentPage();
  }

  updateDisplay() {
    this.filteredSnapshots = this.sorter.sort(this.snapshots, this.sorter.column);
    this.paginator.setTotalItems(this.filteredSnapshots.length);
    this.renderCurrentPage();
    this.renderPagination();
  }

  renderCurrentPage() {
    const pageData = this.paginator.getCurrentPageData(this.filteredSnapshots);
    this.renderer.render(pageData, this.sorter);
  }

  renderPagination() {
    const pageInfo = this.paginator.getPageInfo();
    this.paginationRenderer.render(pageInfo);
  }

  goToPage(page) {
    if (this.paginator.goToPage(page)) {
      this.renderCurrentPage();
      this.renderPagination();
    }
  }

  changePageSize(size) {
    this.paginator.setItemsPerPage(parseInt(size));
    this.renderCurrentPage();
    this.renderPagination();
  }

  async loadSizesAsync() {
    await this.sizeLoader.loadSizesAsync(this.snapshots, (index, size) => {
      const pageData = this.paginator.getCurrentPageData(this.filteredSnapshots);
      const globalIndex = this.filteredSnapshots.findIndex(s => s === this.snapshots[index]);
      const pageIndex = globalIndex - (this.paginator.currentPage - 1) * this.paginator.itemsPerPage;
      
      if (pageIndex >= 0 && pageIndex < pageData.length) {
        this.renderer.updateSize(pageIndex, size);
      }
    });
  }

  logout() {
    window.location.href = '/';
  }
}

function downloadSnapshot(id) {
  const link = document.createElement('a');
  link.href = `/download/${id}`;
  link.download = `snapshot_${id}.gz`;
  link.click();
}

// Глобальные функции для onclick
window.downloadSnapshot = downloadSnapshot;
window.sortSnapshots = (column) => window.snapshotManager.sortSnapshots(column);
window.goToPage = (page) => window.snapshotManager.goToPage(page);
window.changePageSize = (size) => window.snapshotManager.changePageSize(size);

document.addEventListener('DOMContentLoaded', () => {
  window.snapshotManager = new SnapshotManager();
});
