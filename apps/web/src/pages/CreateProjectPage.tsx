import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CreateProjectDto } from '@/lib/projects'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { projectsApi } from '@/lib/projects'
import { useToast } from '@/contexts/ToastContext'
import { Layout } from '@/components/layout/Layout'

export function CreateProjectPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (values: Record<string, unknown>) => {
    setIsLoading(true)
    setError('')
    try {
      const project = await projectsApi.create(values as unknown as CreateProjectDto)
      showToast('Project created', 'success')
      navigate(`/projects/${project.id}`)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to create project'
      setError(message)
      setIsLoading(false)
    }
  }

  return (
    <Layout title="New Project">
      <div className="page-container">
        <h1 className="page-title mb-6">Create New Project</h1>
        <ProjectForm
          mode="create"
          defaultValues={{ type: 'showcase' }}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          submitLabel="Create Project"
        />
      </div>
    </Layout>
  )
}
