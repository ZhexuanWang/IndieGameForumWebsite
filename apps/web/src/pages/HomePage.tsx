import { useEffect, useState } from 'react'
import {
  ArrowRight,
  MessageSquare,
  FolderGit2,
  Heart,
  Share2,
  Code2,
  Megaphone,
  DollarSign,
  Server,
} from 'lucide-react'
import type { ForumThread, Project } from '@flashdev/gameweb-shared'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { projectsApi } from '@/lib/projects'
import { forumApi } from '@/lib/forum'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const features = [
  {
    to: '/forum',
    icon: Share2,
    title: 'Share & Discuss',
    desc: 'Project showcases, devlogs, tech discussions, and player feedback.',
    cta: 'Enter Forum',
  },
  {
    to: '/projects',
    icon: Code2,
    title: 'Development',
    desc: 'Version management, milestones, and collaborative project hosting.',
    cta: 'View Projects',
  },
  {
    to: '/marketplace',
    icon: Megaphone,
    title: 'Promotion',
    desc: 'Project exposure, media partnerships, and targeted promotion.',
    cta: 'Promote',
  },
  {
    to: '/marketplace',
    icon: DollarSign,
    title: 'Sell Projects',
    desc: 'Source code trading, IP transfers, and asset pack sales.',
    cta: 'Marketplace',
  },
  {
    to: '/projects/new',
    icon: Server,
    title: 'Hosting',
    desc: 'Cloud builds, test distribution, and one-stop deployment.',
    cta: 'Host Now',
  },
]

const stats = [
  { value: '12,400+', label: 'Registered Devs' },
  { value: '3,800+', label: 'Projects' },
  { value: '$2.1M', label: 'Total Volume' },
  { value: '98.6%', label: 'Rating' },
]

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
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 20% 40%, oklch(68% 0.20 45 / 0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 60%, oklch(28% 0.08 280 / 0.4) 0%, transparent 55%)',
            }}
          />
        </div>

        <div className="page-container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-cyan/25 bg-brand-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-cyan">
              <Share2 className="h-3.5 w-3.5" />
              FlashDev Indie Game Platform
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Built for Indie Games
              <br />
              <span className="text-brand-cyan">Design · Develop · Trade · Host</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
              An all-in-one web forum connecting indie game developers, players,
              buyers, and hosting teams. From idea to launch, community to
              monetization.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button to="/projects" size="lg">
                Browse Projects
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="ghost" to="/projects/new" size="lg">
                Publish My Project
              </Button>
            </div>

            <div className="mx-auto mt-10 inline-flex items-center gap-2 rounded-md border border-edge bg-surface-1 px-4 py-2 shadow-card">
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
        </div>
      </section>

      <section className="pb-16">
        <div className="page-container">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink">
                Five Core Modules
              </h2>
              <p className="text-sm text-ink-muted">
                Covering the full indie game lifecycle
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(f => {
              const Icon = f.icon
              return (
                <Link
                  key={f.title}
                  to={f.to}
                  className="group block rounded-[10px] border border-edge bg-surface-1 p-6 transition-all duration-200 hover:border-brand-cyan/60 hover:bg-surface-3"
                  style={{ transform: 'translateY(0)' }}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-brand-cyan/20 bg-brand-cyan/10">
                    <Icon className="h-5 w-5 text-brand-cyan" />
                  </div>
                  <h3 className="text-lg font-bold text-ink">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                    {f.desc}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-cyan">
                    {f.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-edge bg-surface-0 py-10">
        <div className="page-container">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="font-mono text-3xl font-bold text-brand-cyan">
                  {s.value}
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-ink-muted">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 pt-12">
        <div className="page-container">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-ink">
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
                      <Card className="hover:border-brand-cyan/50">
                        <h3 className="font-semibold text-ink">{project.title}</h3>
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
                <h2 className="text-xl font-bold text-ink">
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
                      <Card className="hover:border-brand-violet/50">
                        <h3 className="font-semibold text-ink">{thread.title}</h3>
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
