import { useEffect, useState } from 'react'
import { ArrowRight, MessageSquare, FolderGit2, Heart } from 'lucide-react'
import type { ForumThread, Project } from '@flashdev/gameweb-shared'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { projectsApi } from '@/lib/projects'
import { forumApi } from '@/lib/forum'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export function HomePage() {
  const [status, setStatus] = useState<string>('checking...')
  const [projects, setProjects] = useState<Project[]>([])
  const [threads, setThreads] = useState<ForumThread[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api
      .get('/health')
      .then(res => {
        setStatus(res.data.data.status as string)
      })
      .catch(() => {
        setStatus('offline')
      })

    Promise.all([
      projectsApi.list({ limit: 3 }),
      forumApi.listThreads({ limit: 3 }),
    ])
      .then(([projectData, threadData]) => {
        setProjects(projectData.data)
        setThreads(threadData.data)
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <Layout>
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="page-container text-center">
          <span className="mb-4 inline-block rounded-full border border-edge bg-surface-1 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-cyan">
            v0.04 Preview
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold sm:text-5xl md:text-6xl">
            FlashDev Indie Game Forum
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-dim">
            Design, develop, share, trade, and host indie games — all in one
            place.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button to="/projects" size="lg">
              Explore Projects
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="secondary" to="/forum" size="lg">
              Join Forum
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>

          <div className="mx-auto mt-10 inline-flex items-center gap-2 rounded-lg border border-edge bg-surface-1 px-4 py-2 shadow-card">
            <span className="text-sm text-ink-muted">API Status</span>
            <span
              className={`h-2 w-2 rounded-full ${
                status === 'ok' ? 'bg-brand-teal' : 'bg-brand-rose'
              }`}
            />
            <span
              className={`text-sm font-medium ${
                status === 'ok' ? 'text-brand-teal' : 'text-brand-rose'
              }`}
            >
              {status === 'ok' ? 'Connected' : status}
            </span>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="page-container">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-ink">
                  <FolderGit2 className="mr-2 inline h-5 w-5 text-brand-cyan" />
                  Latest Projects
                </h2>
                <Button variant="ghost" size="sm" to="/projects">
                  View all
                </Button>
              </div>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : projects.length ? (
                <div className="space-y-3">
                  {projects.map(project => (
                    <Link key={project.id} to={`/projects/${project.id}`}>
                      <Card className="hover:border-brand-cyan/30">
                        <h3 className="font-medium text-ink">{project.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-ink-dim">
                          {project.description}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-ink-muted">
                          <span className="capitalize">{project.type}</span>
                          <span>·</span>
                          <span className="capitalize">{project.status}</span>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card>
                  <p className="text-center text-sm text-ink-muted">
                    No projects yet.
                  </p>
                </Card>
              )}
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-ink">
                  <MessageSquare className="mr-2 inline h-5 w-5 text-brand-violet" />
                  Hot Threads
                </h2>
                <Button variant="ghost" size="sm" to="/forum">
                  View all
                </Button>
              </div>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : threads.length ? (
                <div className="space-y-3">
                  {threads.map(thread => (
                    <Link key={thread.id} to={`/forum/${thread.id}`}>
                      <Card className="hover:border-brand-violet/30">
                        <h3 className="font-medium text-ink">{thread.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-ink-dim">
                          {thread.body}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-ink-muted">
                          <span>{thread.replyCount} replies</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {thread.viewCount} views
                          </span>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card>
                  <p className="text-center text-sm text-ink-muted">
                    No threads yet.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
