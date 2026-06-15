import { api } from './api'
import type { Follow, FollowStatus } from '@flashdev/gameweb-shared'

export interface FollowToggleResult {
  following: boolean
  count: number
}

export const followsApi = {
  status: (userId: string) =>
    api.get<FollowStatus>(`/follows/status/${userId}`).then(r => r.data),

  toggle: (userId: string) =>
    api
      .post<FollowToggleResult>(`/follows/${userId}`)
      .then(r => r.data),

  followers: (userId: string) =>
    api.get<Follow[]>(`/follows/followers/${userId}`).then(r => r.data),

  following: (userId: string) =>
    api.get<Follow[]>(`/follows/following/${userId}`).then(r => r.data),
}
