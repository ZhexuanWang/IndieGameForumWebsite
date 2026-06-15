import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import type {
  PaginatedResponse,
  Project,
  ProjectCategory,
  ProjectStatus,
  ProjectType,
} from '@flashdev/gameweb-shared'
import { useAuth } from '@/contexts/AuthContext'
import { projectsApi } from '@/lib/projects'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { EmptyState } from '@/components/ui/EmptyState'
import { Pagination } from '@/components/ui/Pagination'
import { Select } from '@/components/ui/Select'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { Layout } from '@/components/layout/Layout'

const typeOptions: { value: ProjectType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'showcase', label: 'Showcase' },
  { value: 'sale', label: 'For Sale' },
  { value: 'custom', label: 'Custom' },
]

const statusOptions: { value: ProjectStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
]

export function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<PaginatedResponse<Project> | null>(
    null,
  )
  const [categories, setCategories] = useState<ProjectCategory[]>([])
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<{
    type: ProjectType | ''
    status: ProjectStatus | ''
    categoryId: string
    search: string
  }>({ type: '', status: '', categoryId: '', search: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(c => ({ value: c.id, label: c.name })),
  ]

  const loadProjects = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await projectsApi.list({
        page,
        limit: 12,
        type: filters.type || undefined,
        status: filters.status || undefined,
        categoryId: filters.categoryId || undefined,
        search: filters.search || undefined,
      })
      setProjects(data)
    } catch {
      setError('Failed to load projects')
    } finally {
      setIsLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await projectsApi.categories()
      setCategories(data)
    } catch {
      // non-critical
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadProjects()
  }, [page, filters])

  const updateFilter = (
    key: keyof typeof filters,
    value: string,
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const categoryMap = new Map(categories.map(c => [c.id, c.name]))

  return (
    <Layout title="Projects">
      <div className="page-container">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Projects</h1>
            <p className="mt-1 text-ink-dim">
              Discover, share and trade indie games.
            </p>
          </div>
          {user && (
            <Button variant="secondary" to="/projects/new">
              New Project
            </Button>
          )}
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <Input
              placeholder="Search projects..."
              value={filters.search}
              onChange={e => updateFilter('search', e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={filters.type}
            onChange={e => updateFilter('type', e.target.value)}
            options={typeOptions}
          />
          <Select
            value={filters.status}
            onChange={e => updateFilter('status', e.target.value)}
            options={statusOptions}
          />
          <Select
            value={filters.categoryId}
            onChange={e => updateFilter('categoryId', e.target.value)}
            options={categoryOptions}
          />
        </div>

        <ErrorMessage message={error} />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : projects?.data.length ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.data.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  categoryName={
                    project.categoryId
                      ? categoryMap.get(project.categoryId)
                      : undefined
                  }
                />
              ))}
            </div>
            <div className="mt-8">
              <Pagination
                page={page}
                totalPages={projects.totalPages}
                onChange={setPage}
              />
            </div>
          </>
        ) : (
          <EmptyState
            title="No projects found"
            description="Try adjusting filters or create the first project."
            action={
              user ? (
                <Button to="/projects/new">Create Project</Button>
              ) : (
                <Button to="/login">Log in to create</Button>
              )
            }
          />
        )}
      </div>
    </Layout>
  )
}
