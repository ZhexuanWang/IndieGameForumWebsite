import { api } from './api'
import type { LoginDto, RegisterDto, User } from '@flashdev/gameweb-shared'

export interface AuthResult {
  user: User
  accessToken: string
}

export const authApi = {
  me: () => api.get<{ user: User }>('/auth/me').then(r => r.data.user),

  login: (dto: LoginDto) =>
    api.post<AuthResult>('/auth/login', dto).then(r => r.data),

  register: (dto: RegisterDto) =>
    api.post<AuthResult>('/auth/register', dto).then(r => r.data),

  logout: () => api.post('/auth/logout').then(r => r.data),

  refresh: () =>
    api.post<AuthResult>('/auth/refresh').then(r => r.data),
}
