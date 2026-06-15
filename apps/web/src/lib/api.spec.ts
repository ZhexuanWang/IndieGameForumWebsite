import { describe, it, expect } from 'vitest'
import { TOKEN_KEY } from './api'

describe('api client constants', () => {
  it('uses the correct localStorage token key', () => {
    expect(TOKEN_KEY).toBe('flashdev.access_token')
  })
})
