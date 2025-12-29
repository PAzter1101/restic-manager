export class Formatter {
  static formatSize(bytes) {
    if (!bytes) return '—';
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  static formatPaths(paths) {
    if (!paths?.length) return '—';
    
    if (paths.length === 1) {
      const path = paths[0];
      const fileName = path.split('/').pop();
      return `<span title="${path}">${fileName}</span>`;
    }
    
    return `<span title="${paths.join('\n')}">${paths.length} файлов</span>`;
  }

  static formatDate(dateString) {
    return new Date(dateString).toLocaleString('ru');
  }
}
