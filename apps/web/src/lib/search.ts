import { api } from './api'
import type { SearchResults } from '@flashdev/gameweb-shared'

export const searchApi = {
  global: (query: string, limit = 10) =>
    api
      .get<SearchResults>('/search', { params: { q: query, limit } })
      .then(r => r.data),
}
