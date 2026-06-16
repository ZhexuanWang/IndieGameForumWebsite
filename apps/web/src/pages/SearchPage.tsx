import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import type { SearchResults } from '@flashdev/gameweb-shared'
import { searchApi } from '@/lib/search'
import { Layout } from '@/components/layout/Layout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { EmptyState } from '@/components/ui/EmptyState'
import { Tag } from '@/components/ui/Tag'

type TabKey = 'all' | 'projects' | 'threads' | 'listings' | 'users'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'projects', label: 'Projects' },
  { key: 'threads', label: 'Forum' },
  { key: 'listings', label: 'Marketplace' },
  { key: 'users', label: 'Users' },
]

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!initialQuery.trim()) {
      setResults(null)
      return
    }
    const load = async () => {
      setIsLoading(true)
      setError('')
      try {
        const data = await searchApi.global(initialQuery)
        setResults(data)
      } catch {
        setError('Search failed')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [initialQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearchParams({ q: query.trim() })
  }

  const totalCount =
    (results?.projects.length ?? 0) +
    (results?.threads.length ?? 0) +
    (results?.listings.length ?? 0) +
    (results?.users.length ?? 0)

  return (
    <Layout title={initialQuery ? `Search: ${initialQuery}` : 'Search'}>
      <div className="page-container max-w-4xl">
        <h1 className="page-title mb-6">Search</h1>

        <form onSubmit={handleSubmit} className="mb-8 flex gap-3">
          <Input
            placeholder="Search projects, threads, listings, users..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={!query.trim()}>
            Search
          </Button>
        </form>

        {initialQuery && (
          <div className="mb-6 flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-pill px-3 py-1 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-brand-cyan text-deep'
                    : 'bg-surface-1 text-ink-dim hover:bg-surface-2'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <ErrorMessage message={error} />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : results ? (
          totalCount === 0 ? (
            <EmptyState
              title="No results"
              description={`Nothing matched "${initialQuery}".`}
            />
          ) : (
            <div className="space-y-8">
              {(activeTab === 'all' || activeTab === 'projects') &&
                results.projects.length > 0 && (
                  <ResultSection title="Projects">
                    {results.projects.map(project => (
                      <Link key={project.id} to={`/projects/${project.id}`}>
                        <Card className="hover:border-brand-cyan/30">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-medium text-ink">
                              {project.title}
                            </h3>
                            <Tag color="cyan">{project.type}</Tag>
                          </div>
                          <p className="mt-1 text-sm text-ink-dim">
                            by {project.authorName}
                          </p>
                        </Card>
                      </Link>
                    ))}
                  </ResultSection>
                )}

              {(activeTab === 'all' || activeTab === 'threads') &&
                results.threads.length > 0 && (
                  <ResultSection title="Forum Threads">
                    {results.threads.map(thread => (
                      <Link key={thread.id} to={`/forum/${thread.id}`}>
                        <Card className="hover:border-brand-cyan/30">
                          <h3 className="font-medium text-ink">
                            {thread.title}
                          </h3>
                          <p className="mt-1 text-sm text-ink-dim">
                            by {thread.authorName}
                            {thread.categoryName && ` · ${thread.categoryName}`}
                          </p>
                        </Card>
                      </Link>
                    ))}
                  </ResultSection>
                )}

              {(activeTab === 'all' || activeTab === 'listings') &&
                results.listings.length > 0 && (
                  <ResultSection title="Marketplace">
                    {results.listings.map(listing => (
                      <Link key={listing.id} to={`/marketplace/${listing.id}`}>
                        <Card className="hover:border-brand-cyan/30">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-medium text-ink">
                              {listing.title}
                            </h3>
                            <Tag color="amber">{listing.type}</Tag>
                          </div>
                          <p className="mt-1 text-sm text-ink-dim">
                            by {listing.sellerName}
                          </p>
                        </Card>
                      </Link>
                    ))}
                  </ResultSection>
                )}

              {(activeTab === 'all' || activeTab === 'users') &&
                results.users.length > 0 && (
                  <ResultSection title="Users">
                    {results.users.map(user => (
                      <Link key={user.id} to={`/users/${user.id}`}>
                        <Card className="hover:border-brand-cyan/30">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-medium text-ink">
                              {user.displayName ?? user.email}
                            </h3>
                            <Tag color="violet">{user.role}</Tag>
                          </div>
                          <p className="mt-1 text-sm text-ink-dim">
                            {user.email}
                          </p>
                        </Card>
                      </Link>
                    ))}
                  </ResultSection>
                )}
            </div>
          )
        ) : null}
      </div>
    </Layout>
  )
}

function ResultSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-medium text-ink">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}
