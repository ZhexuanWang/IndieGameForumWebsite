import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Project } from '@flashdev/gameweb-shared'
import { useAuth } from '@/contexts/AuthContext'
import { projectsApi } from '@/lib/projects'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Layout } from '@/components/layout/Layout'

export function EditProjectPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    projectsApi
      .get(id)
      .then(data => {
        if (
          data.authorId !== user?.id &&
          user?.role !== 'admin' &&
          user?.role !== 'company'
        ) {
          setError('You do not have permission to edit this project')
        } else {
          setProject(data)
        }
      })
      .catch(() => setError('Project not found'))
      .finally(() => setIsLoading(false))
  }, [id, user])

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!id) return
    setIsSaving(true)
    setError('')
    try {
      await projectsApi.update(id, values as Parameters<typeof projectsApi.update>[1])
      navigate(`/projects/${id}`)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to update project'
      setError(message)
      setIsSaving(false)
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
      <Layout title="Error">
        <div className="page-container">
          <ErrorMessage message={error} />
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Edit Project">
      <div className="page-container">
        <h1 className="page-title mb-6">Edit Project</h1>
        <ProjectForm
          mode="edit"
          defaultValues={{
            title: project.title,
            description: project.description,
            type: project.type,
            categoryId: project.categoryId ?? '',
            price: project.price ?? undefined,
            tagsString: project.tags?.join(', ') ?? '',
            thumbnailUrl: project.thumbnailUrl ?? '',
            demoUrl: project.demoUrl ?? '',
            status: project.status,
          }}
          onSubmit={handleSubmit}
          isLoading={isSaving}
          error={error}
          submitLabel="Save Changes"
        />
      </div>
    </Layout>
  )
}
