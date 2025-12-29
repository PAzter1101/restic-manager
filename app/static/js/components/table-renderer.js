import { Formatter } from '../utils/formatter.js';

export class TableRenderer {
  constructor(containerId, onSort, onDownload) {
    this.container = document.getElementById(containerId);
    this.onSort = onSort;
    this.onDownload = onDownload;
  }

  render(snapshots, sorter) {
    if (!snapshots?.length) {
      this.container.innerHTML = '<div class="empty">📭 Снапшоты не найдены</div>';
      return;
    }

    const rows = snapshots.map((snap, index) => `
      <tr data-index="${index}">
        <td><code>${snap.short_id}</code></td>
        <td>${Formatter.formatDate(snap.time)}</td>
        <td>${snap.hostname}</td>
        <td>${snap.username || '—'}</td>
        <td>${snap.tags?.join(', ') || '—'}</td>
        <td>${Formatter.formatPaths(snap.paths)}</td>
        <td class="size-cell">${snap.size ? Formatter.formatSize(snap.size) : '<div class="spinner-small"></div>'}</td>
        <td>
          <button class="btn btn-success" onclick="window.downloadSnapshot('${snap.short_id}')">
            📥 Скачать
          </button>
        </td>
      </tr>
    `).join('');

    this.container.innerHTML = `
      <table>
        <thead>
          <tr>
            ${this._renderHeader('short_id', '🆔 ID', sorter)}
            ${this._renderHeader('time', '🕒 Время', sorter)}
            ${this._renderHeader('hostname', '🖥️ Хост', sorter)}
            ${this._renderHeader('username', '👤 Пользователь', sorter)}
            ${this._renderHeader('tags', '🏷️ Теги', sorter)}
            ${this._renderHeader('paths', '📁 Пути', sorter)}
            ${this._renderHeader('size', '📊 Размер', sorter)}
            <th>⚡ Действия</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  _renderHeader(column, title, sorter) {
    return `<th onclick="window.sortSnapshots('${column}')" style="cursor: pointer;">
      ${title} ${sorter.getIcon(column)}
    </th>`;
  }

  updateSize(index, size) {
    const row = this.container.querySelector(`tr[data-index="${index}"]`);
    if (row) {
      const sizeCell = row.querySelector('.size-cell');
      if (sizeCell) {
        sizeCell.textContent = Formatter.formatSize(size);
      }
    }
  }

  showLoading() {
    this.container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Загрузка...</p></div>';
  }

  showError(message) {
    this.container.innerHTML = `<div class="error">❌ ${message}</div>`;
  }
}
