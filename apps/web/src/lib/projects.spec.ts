import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from './api'
import { projectsApi } from './projects'

describe('projectsApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches categories', async () => {
    const categories = [{ id: '1', name: 'RPG', slug: 'rpg', createdAt: '' }]
    vi.spyOn(api, 'get').mockResolvedValue({ data: categories })

    const result = await projectsApi.categories()

    expect(api.get).toHaveBeenCalledWith('/projects/categories')
    expect(result).toEqual(categories)
  })

  it('lists projects with query params', async () => {
    const response = {
      data: [],
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 0,
    }
    vi.spyOn(api, 'get').mockResolvedValue({ data: response })

    const result = await projectsApi.list({ page: 2, search: 'rpg' })

    expect(api.get).toHaveBeenCalledWith('/projects', {
      params: { page: 2, search: 'rpg' },
    })
    expect(result).toEqual(response)
  })

  it('creates a project', async () => {
    const project = { id: 'p1', title: 'Test' } as unknown as Awaited<
      ReturnType<typeof projectsApi.create>
    >
    vi.spyOn(api, 'post').mockResolvedValue({ data: project })

    const result = await projectsApi.create({
      title: 'Test',
      description: 'A test project',
      type: 'showcase',
    })

    expect(api.post).toHaveBeenCalledWith('/projects', {
      title: 'Test',
      description: 'A test project',
      type: 'showcase',
    })
    expect(result).toEqual(project)
  })
})
