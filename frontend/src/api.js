import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export const apiClient = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

// Backwards compatible helper used across pages
export async function api(path, { method='GET', body, headers } = {}){
  const res = await apiClient.request({ url: path, method, data: body, headers })
  return res.data
}

export { BASE as API_BASE }
