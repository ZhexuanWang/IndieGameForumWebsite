import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
export const TOKEN_KEY = 'flashdev.access_token'

export const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function storeToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function hasToken() {
  return Boolean(localStorage.getItem(TOKEN_KEY))
}
