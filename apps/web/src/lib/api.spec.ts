import { describe, it, expect } from 'vitest'
import { TOKEN_KEY } from './api'
import { authApi } from './auth'
import { projectsApi } from './projects'
import { forumApi } from './forum'
import { likesApi } from './likes'
import { followsApi } from './follows'
import { usersApi } from './users'

describe('api client constants', () => {
  it('uses the correct localStorage token key', () => {
    expect(TOKEN_KEY).toBe('flashdev.access_token')
  })
})

describe('domain api modules', () => {
  it('exports auth api', () => {
    expect(authApi).toBeDefined()
    expect(typeof authApi.login).toBe('function')
  })

  it('exports projects api', () => {
    expect(projectsApi).toBeDefined()
    expect(typeof projectsApi.list).toBe('function')
  })

  it('exports forum api', () => {
    expect(forumApi).toBeDefined()
    expect(typeof forumApi.listThreads).toBe('function')
  })

  it('exports likes api', () => {
    expect(likesApi).toBeDefined()
    expect(typeof likesApi.toggle).toBe('function')
  })

  it('exports follows api', () => {
    expect(followsApi).toBeDefined()
    expect(typeof followsApi.toggle).toBe('function')
  })

  it('exports users api', () => {
    expect(usersApi).toBeDefined()
    expect(typeof usersApi.get).toBe('function')
  })
})
