export class Sorter {
  constructor() {
    this.column = 'time';
    this.direction = 'desc';
  }

  sort(data, column) {
    if (this.column === column) {
      this.direction = this.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.column = column;
      this.direction = column === 'time' ? 'desc' : 'asc';
    }

    return [...data].sort((a, b) => {
      const aVal = this._getValue(a, column);
      const bVal = this._getValue(b, column);
      
      if (aVal < bVal) return this.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  _getValue(item, column) {
    let val = item[column];
    
    switch (column) {
      case 'time':
        return new Date(val);
      case 'size':
        return val || 0;
      case 'tags':
      case 'paths':
        return (val || []).join(', ').toLowerCase();
      default:
        return typeof val === 'string' ? val.toLowerCase() : val;
    }
  }

  getIcon(column) {
    if (this.column !== column) return '';
    return this.direction === 'asc' ? '↑' : '↓';
  }
}
