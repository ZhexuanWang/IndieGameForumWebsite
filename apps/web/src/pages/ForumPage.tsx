import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import type {
  ForumCategory,
  ForumThread,
  PaginatedResponse,
} from '@flashdev/gameweb-shared'
import { useAuth } from '@/contexts/AuthContext'
import { forumApi } from '@/lib/forum'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { EmptyState } from '@/components/ui/EmptyState'
import { Pagination } from '@/components/ui/Pagination'
import { ThreadRow } from '@/components/forum/ThreadRow'
import { Layout } from '@/components/layout/Layout'

export function ForumPage() {
  const { user } = useAuth()
  const [threads, setThreads] = useState<PaginatedResponse<ForumThread> | null>(
    null,
  )
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [activeCategoryId, setActiveCategoryId] = useState<string>('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadCategories = async () => {
    try {
      const data = await forumApi.categories()
      setCategories(data)
    } catch {
      // non-critical
    }
  }

  const loadThreads = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await forumApi.listThreads({
        categoryId: activeCategoryId || undefined,
        search: search || undefined,
        page,
        limit: 15,
      })
      setThreads(data)
    } catch {
      setError('Failed to load threads')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadThreads()
  }, [activeCategoryId, page, search])

  const categoryMap = new Map(categories.map(c => [c.id, c]))

  return (
    <Layout title="Forum">
      <div className="page-container">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Forum</h1>
            <p className="mt-1 text-ink-dim">
              Discuss ideas, share progress, and get feedback.
            </p>
          </div>
          {user && (
            <Button variant="secondary" to="/forum/new">
              New Thread
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-4">
            <div className="card">
              <h2 className="mb-3 text-sm font-medium text-ink">Categories</h2>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setActiveCategoryId('')
                    setPage(1)
                  }}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    activeCategoryId === ''
                      ? 'bg-surface-2 text-ink'
                      : 'text-ink-dim hover:bg-surface-2 hover:text-ink'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategoryId(category.id)
                      setPage(1)
                    }}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      activeCategoryId === category.id
                        ? 'bg-surface-2 text-ink'
                        : 'text-ink-dim hover:bg-surface-2 hover:text-ink'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <Input
                placeholder="Search threads..."
                value={search}
                onChange={e => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-9"
              />
            </div>

            <ErrorMessage message={error} />

            {isLoading ? (
              <div className="flex justify-center py-16">
                <LoadingSpinner size="lg" />
              </div>
            ) : threads?.data.length ? (
              <>
                <div className="space-y-3">
                  {threads.data.map(thread => (
                    <ThreadRow
                      key={thread.id}
                      thread={thread}
                      category={
                        thread.categoryId
                          ? categoryMap.get(thread.categoryId)
                          : undefined
                      }
                    />
                  ))}
                </div>
                <div className="mt-6">
                  <Pagination
                    page={page}
                    totalPages={threads.totalPages}
                    onChange={setPage}
                  />
                </div>
              </>
            ) : (
              <EmptyState
                title="No threads found"
                description="Be the first to start a discussion."
                action={
                  user ? (
                    <Button to="/forum/new">New Thread</Button>
                  ) : (
                    <Button to="/login">Log in to post</Button>
                  )
                }
              />
            )}
          </section>
        </div>
      </div>
    </Layout>
  )
}
