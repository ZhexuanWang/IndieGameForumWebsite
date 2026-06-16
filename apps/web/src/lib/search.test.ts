import { describe, it, expect } from 'vitest'
import { searchApi } from './search'

describe('search api', () => {
  it('exports global search function', () => {
    expect(searchApi).toBeDefined()
    expect(typeof searchApi.global).toBe('function')
  })
})
