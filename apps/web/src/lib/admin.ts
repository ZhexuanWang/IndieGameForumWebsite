import { api } from './api'
import type { PaginatedResponse, PublicUser, UserRole } from '@flashdev/gameweb-shared'

export interface AdminUserQuery {
  page?: number
  limit?: number
  search?: string
}

export const adminApi = {
  users: (query: AdminUserQuery = {}) =>
    api.get<PaginatedResponse<PublicUser>>('/admin/users', { params: query }).then(r => r.data),

  updateRole: (id: string, role: UserRole) =>
    api.patch(`/admin/users/${id}/role`, { role }).then(r => r.data),
}
