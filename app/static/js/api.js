class ApiClient {
  async request(url, options = {}) {
    const response = await fetch(url, options);
    
    if (response.status === 401) {
      window.location.href = '/';
      return;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return response.json();
  }

  async getSnapshots(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/snapshots?${params}`);
  }

  async getSnapshotSize(snapshotId) {
    return this.request(`/snapshot/${snapshotId}/size`);
  }
}

window.ApiClient = ApiClient;
