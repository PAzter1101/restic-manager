import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authService = {
  async login(username: string, password: string) {
    const response = await api.post('/login', { username, password })
    const { access_token } = response.data
    localStorage.setItem('token', access_token)
    return access_token
  },

  logout() {
    localStorage.removeItem('token')
  }
}

export interface Snapshot {
  id: string
  time: string
  hostname: string
  tags: string[]
  paths: string[]
  short_id: string
}

export interface SnapshotFile {
  name: string
  type: 'file' | 'dir'
  path: string
  size?: number
  mtime?: string
}

export const snapshotService = {
  async getSnapshots(params?: {
    host?: string
    tag?: string
    page?: number
    limit?: number
  }) {
    const response = await api.get('/snapshots', { params })
    return response.data
  },

  async getSnapshotFiles(snapshotId: string, path: string = '/') {
    const response = await api.get(`/snapshots/${snapshotId}/files`, {
      params: { path }
    })
    return response.data as SnapshotFile[]
  },

  getDownloadUrl(snapshotId: string, filePath: string) {
    return `/api/download/${snapshotId}${filePath}`
  }
}

export default api
