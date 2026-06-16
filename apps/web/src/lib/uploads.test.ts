import { describe, it, expect } from 'vitest'
import { uploadsApi } from './uploads'

describe('uploads api', () => {
  it('exports upload function', () => {
    expect(uploadsApi).toBeDefined()
    expect(typeof uploadsApi.upload).toBe('function')
  })
})
