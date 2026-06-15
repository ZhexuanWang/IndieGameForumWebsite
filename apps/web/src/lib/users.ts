import { api } from './api'
import type { PublicUser } from '@flashdev/gameweb-shared'

export const usersApi = {
  get: (id: string) => api.get<PublicUser>(`/users/${id}`).then(r => r.data),
}
