import { describe, it, expect } from 'vitest'
import { adminApi } from './admin'

describe('admin api', () => {
  it('exports users list and role update functions', () => {
    expect(adminApi).toBeDefined()
    expect(typeof adminApi.users).toBe('function')
    expect(typeof adminApi.updateRole).toBe('function')
  })
})
