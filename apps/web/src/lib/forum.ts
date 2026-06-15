import { api } from './api'
import type {
  CreatePostDto,
  CreateThreadDto,
  ForumCategory,
  ForumPost,
  ForumThread,
  PaginatedResponse,
} from '@flashdev/gameweb-shared'

export interface ThreadQuery {
  categoryId?: string
  page?: number
  limit?: number
  search?: string
  authorId?: string
}

export const forumApi = {
  categories: () =>
    api.get<ForumCategory[]>('/forum/categories').then(r => r.data),

  listThreads: (query: ThreadQuery = {}) =>
    api
      .get<PaginatedResponse<ForumThread>>('/forum/threads', { params: query })
      .then(r => r.data),

  getThread: (id: string) =>
    api.get<ForumThread>(`/forum/threads/${id}`).then(r => r.data),

  listPosts: (
    threadId: string,
    query: { page?: number; limit?: number } = {},
  ) =>
    api
      .get<PaginatedResponse<ForumPost>>(`/forum/threads/${threadId}/posts`, {
        params: query,
      })
      .then(r => r.data),

  listReplies: (
    postId: string,
    query: { page?: number; limit?: number } = {},
  ) =>
    api
      .get<PaginatedResponse<ForumPost>>(`/forum/posts/${postId}/replies`, {
        params: query,
      })
      .then(r => r.data),

  createThread: (dto: CreateThreadDto) =>
    api.post<ForumThread>('/forum/threads', dto).then(r => r.data),

  createPost: (threadId: string, dto: CreatePostDto) =>
    api
      .post<ForumPost>(`/forum/threads/${threadId}/posts`, dto)
      .then(r => r.data),

  deleteThread: (id: string) =>
    api.delete(`/forum/threads/${id}`).then(r => r.data),

  deletePost: (id: string) =>
    api.delete(`/forum/posts/${id}`).then(r => r.data),
}
