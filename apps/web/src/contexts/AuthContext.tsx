import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import axios from 'axios'
import { api, clearToken, hasToken, storeToken } from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'
import type { LoginDto, RegisterDto, User } from '@flashdev/gameweb-shared'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (dto: LoginDto) => Promise<void>
  register: (dto: RegisterDto) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()
  const isRefreshingRef = useRef(false)
  const queueRef = useRef<
    Array<{
      resolve: (token: string) => void
      reject: (error: unknown) => void
    }>
  >([])

  const clearSession = useCallback(() => {
    clearToken()
    delete api.defaults.headers.common.Authorization
    setUser(null)
  }, [])

  const processQueue = useCallback(
    (error: unknown | null, token: string | null) => {
      queueRef.current.forEach(promise => {
        if (error || token === null) {
          promise.reject(error ?? new Error('Refresh failed'))
        } else {
          promise.resolve(token)
        }
      })
      queueRef.current = []
    },
    [],
  )

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get<{ user: User }>('/auth/me')
      setUser(res.data.user)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config
        if (
          error.response?.status !== 401 ||
          !originalRequest ||
          originalRequest._retry
        ) {
          return Promise.reject(error)
        }

        if (!isRefreshingRef.current) {
          isRefreshingRef.current = true
          try {
            const baseURL = api.defaults.baseURL ?? ''
            const res = await axios.get<{
              user: User
              accessToken: string
            }>(`${baseURL}/auth/refresh`, {
              withCredentials: true,
            })
            const { accessToken } = res.data
            storeToken(accessToken)
            api.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            processQueue(null, accessToken)
            isRefreshingRef.current = false

            originalRequest._retry = true
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            return api(originalRequest)
          } catch (refreshError) {
            processQueue(refreshError, null)
            clearSession()
            isRefreshingRef.current = false
            return Promise.reject(refreshError)
          }
        }

        return new Promise((resolve, reject) => {
          queueRef.current.push({
            resolve: token => {
              originalRequest._retry = true
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(api(originalRequest))
            },
            reject,
          })
        })
      },
    )

    return () => {
      api.interceptors.response.eject(interceptor)
    }
  }, [clearSession, processQueue])

  useEffect(() => {
    if (!hasToken()) {
      setIsLoading(false)
      return
    }
    refreshUser().finally(() => setIsLoading(false))
  }, [refreshUser])

  const login = useCallback(
    async (dto: LoginDto) => {
      const res = await api.post<{ user: User; accessToken: string }>(
        '/auth/login',
        dto,
      )
      storeToken(res.data.accessToken)
      api.defaults.headers.common.Authorization = `Bearer ${res.data.accessToken}`
      setUser(res.data.user)
      showToast('Welcome back!', 'success')
    },
    [showToast],
  )

  const register = useCallback(
    async (dto: RegisterDto) => {
      const res = await api.post<{ user: User; accessToken: string }>(
        '/auth/register',
        dto,
      )
      storeToken(res.data.accessToken)
      api.defaults.headers.common.Authorization = `Bearer ${res.data.accessToken}`
      setUser(res.data.user)
      showToast('Account created', 'success')
    },
    [showToast],
  )

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
      showToast('Logged out', 'info')
    } finally {
      clearSession()
    }
  }, [clearSession, showToast])

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
