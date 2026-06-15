import { api } from './api'
import type { LikeStatus, LikeTargetType } from '@flashdev/gameweb-shared'

export const likesApi = {
  status: (targetType: LikeTargetType, targetId: string) =>
    api
      .get<LikeStatus>(`/likes/${targetType}/${targetId}/status`)
      .then(r => r.data),

  toggle: (targetType: LikeTargetType, targetId: string) =>
    api
      .post<LikeStatus>(`/likes/${targetType}/${targetId}`)
      .then(r => r.data),

  me: () => api.get('/likes/me').then(r => r.data),
}
