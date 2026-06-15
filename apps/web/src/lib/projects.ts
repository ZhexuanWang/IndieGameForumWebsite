import { api } from './api'
import type {
  PaginatedResponse,
  Project,
  ProjectCategory,
  ProjectStatus,
  ProjectType,
} from '@flashdev/gameweb-shared'

export interface CreateProjectDto {
  title: string
  description: string
  type: ProjectType
  categoryId?: string
  price?: number
  tags?: string[]
  thumbnailUrl?: string
  demoUrl?: string
}

export interface UpdateProjectDto {
  title?: string
  description?: string
  type?: ProjectType
  categoryId?: string
  price?: number
  tags?: string[]
  thumbnailUrl?: string
  demoUrl?: string
  status?: ProjectStatus
}

export interface ProjectQuery {
  page?: number
  limit?: number
  type?: ProjectType
  status?: ProjectStatus
  categoryId?: string
  authorId?: string
  search?: string
}

export const projectsApi = {
  categories: () =>
    api.get<ProjectCategory[]>('/projects/categories').then(r => r.data),

  list: (query: ProjectQuery = {}) =>
    api
      .get<PaginatedResponse<Project>>('/projects', { params: query })
      .then(r => r.data),

  get: (id: string) =>
    api.get<Project>(`/projects/${id}`).then(r => r.data),

  create: (dto: CreateProjectDto) =>
    api.post<Project>('/projects', dto).then(r => r.data),

  update: (id: string, dto: UpdateProjectDto) =>
    api.patch<Project>(`/projects/${id}`, dto).then(r => r.data),

  remove: (id: string) => api.delete(`/projects/${id}`).then(r => r.data),
}
