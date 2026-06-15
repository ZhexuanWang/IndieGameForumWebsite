import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from './api'
import { forumApi } from './forum'

describe('forumApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches categories', async () => {
    const categories = [{ id: '1', name: 'General', slug: 'general' }]
    vi.spyOn(api, 'get').mockResolvedValue({ data: categories })

    const result = await forumApi.categories()

    expect(api.get).toHaveBeenCalledWith('/forum/categories')
    expect(result).toEqual(categories)
  })

  it('lists threads with query params', async () => {
    const response = {
      data: [],
      total: 0,
      page: 1,
      limit: 15,
      totalPages: 0,
    }
    vi.spyOn(api, 'get').mockResolvedValue({ data: response })

    const result = await forumApi.listThreads({ categoryId: '1', page: 2 })

    expect(api.get).toHaveBeenCalledWith('/forum/threads', {
      params: { categoryId: '1', page: 2 },
    })
    expect(result).toEqual(response)
  })

  it('creates a thread', async () => {
    const thread = { id: 't1', title: 'Hello' } as unknown as Awaited<
      ReturnType<typeof forumApi.createThread>
    >
    vi.spyOn(api, 'post').mockResolvedValue({ data: thread })

    const result = await forumApi.createThread({
      title: 'Hello',
      body: 'World',
    })

    expect(api.post).toHaveBeenCalledWith('/forum/threads', {
      title: 'Hello',
      body: 'World',
    })
    expect(result).toEqual(thread)
  })
})
