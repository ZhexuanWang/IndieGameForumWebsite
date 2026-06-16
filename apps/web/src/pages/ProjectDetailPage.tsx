import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ExternalLink,
  Pencil,
  Trash2,
  User as UserIcon,
  Download,
  File as FileIcon,
} from 'lucide-react'
import type { Project, ProjectCategory } from '@flashdev/gameweb-shared'
import { useAuth } from '@/contexts/AuthContext'
import { projectsApi } from '@/lib/projects'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Tag } from '@/components/ui/Tag'
import { LikeButton } from '@/components/social/LikeButton'
import { Layout } from '@/components/layout/Layout'
import { formatBytes } from '@/components/ui/FileInput'

const typeLabel: Record<string, string> = {
  showcase: 'Showcase',
  sale: 'For Sale',
  custom: 'Custom',
}

const typeColor: Record<string, 'cyan' | 'violet' | 'amber'> = {
  showcase: 'cyan',
  sale: 'amber',
  custom: 'violet',
}

const statusColor: Record<string, 'teal' | 'amber' | 'rose'> = {
  published: 'teal',
  draft: 'amber',
  archived: 'rose',
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [category, setCategory] = useState<ProjectCategory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    projectsApi
      .get(id)
      .then(data => {
        setProject(data)
        if (data.categoryId) {
          projectsApi
            .categories()
            .then(cats => {
              const found = cats.find(c => c.id === data.categoryId)
              if (found) setCategory(found)
            })
            .catch(() => {})
        }
      })
      .catch(() => setError('Project not found'))
      .finally(() => setIsLoading(false))
  }, [id])

  const canEdit =
    user &&
    project &&
    (project.authorId === user.id ||
      user.role === 'admin' ||
      user.role === 'company')

  const handleDelete = async () => {
    if (!project || !window.confirm('Delete this project?')) return
    try {
      await projectsApi.remove(project.id)
      navigate('/projects')
    } catch {
      setError('Failed to delete project')
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    )
  }

  if (!project) {
    return (
      <Layout title="Not Found">
        <div className="page-container">
          <ErrorMessage message={error || 'Project not found'} />
          <Button variant="ghost" to="/projects" className="mt-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={project.title}>
      <div className="page-container">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" to="/projects">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {canEdit && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                to={`/projects/${project.id}/edit`}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>

        <Card className="border-edge-strong">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Tag color={typeColor[project.type]}>
              {typeLabel[project.type]}
            </Tag>
            <Tag color={statusColor[project.status]}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Tag>
            {category && (
              <span className="text-sm text-ink-muted">{category.name}</span>
            )}
          </div>

          <h1 className="text-3xl font-semibold text-ink">{project.title}</h1>

          <div className="mt-3 flex items-center gap-2 text-sm text-ink-dim">
            <UserIcon className="h-4 w-4" />
            <Link
              to={`/users/${project.authorId}`}
              className="hover:text-brand-cyan"
            >
              {project.authorId}
            </Link>
            <span>·</span>
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>

          {project.thumbnailUrl && (
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="mt-6 w-full rounded-lg object-cover ring-1 ring-edge"
            />
          )}

          <p className="mt-6 whitespace-pre-wrap text-ink-dim">
            {project.description}
          </p>

          {project.tags && project.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span
                  key={tag}
                  className="rounded-pill bg-surface-2 px-3 py-1 text-xs text-ink-dim"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {project.files && project.files.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-medium text-ink">Downloads</h2>
              <div className="space-y-2">
                {project.files.map(file => (
                  <a
                    key={file.id}
                    href={file.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-lg border border-edge bg-surface-0 p-3 hover:border-brand-cyan/30"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileIcon className="h-5 w-5 shrink-0 text-ink-muted" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">
                          {file.originalName}
                        </p>
                        <p className="text-xs text-ink-muted">
                          {formatBytes(file.size)}
                          {file.version ? ` · ${file.version}` : ''}
                        </p>
                      </div>
                    </div>
                    <Download className="h-4 w-4 shrink-0 text-brand-cyan" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <LikeButton targetType="PROJECT" targetId={project.id} />
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
              >
                <ExternalLink className="h-4 w-4" />
                Demo
              </a>
            )}
            {project.price !== null && project.price > 0 && (
              <span className="text-lg font-medium text-brand-amber">
                ${project.price}
              </span>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  )
}
