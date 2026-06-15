import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ProjectCategory, ProjectStatus } from '@flashdev/gameweb-shared'
import { projectsApi } from '@/lib/projects'
import {
  projectFormSchema,
  type ProjectFormSchema,
} from '@/lib/validation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

interface ProjectFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Partial<ProjectFormSchema> & { status?: ProjectStatus }
  onSubmit: (values: ProjectFormSchema) => Promise<void>
  isLoading: boolean
  error: string
  submitLabel: string
}

const typeOptions = [
  { value: 'showcase', label: 'Showcase' },
  { value: 'sale', label: 'For Sale' },
  { value: 'custom', label: 'Custom' },
]

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

export function ProjectForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading,
  error,
  submitLabel,
}: ProjectFormProps) {
  const [categories, setCategories] = useState<ProjectCategory[]>([])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProjectFormSchema>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  })

  const type = watch('type')

  useEffect(() => {
    projectsApi.categories().then(setCategories).catch(() => {})
  }, [])

  const categoryOptions = [
    { value: '', label: 'No category' },
    ...categories.map(c => ({ value: c.id, label: c.name })),
  ]

  const submitHandler = async (values: ProjectFormSchema) => {
    const payload: Record<string, unknown> = { ...values }

    if (payload.categoryId === '') delete payload.categoryId
    if (payload.thumbnailUrl === '') delete payload.thumbnailUrl
    if (payload.demoUrl === '') delete payload.demoUrl

    const tagsString = payload.tagsString ?? ''
    payload.tags = String(tagsString)
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
    delete payload.tagsString

    if (type !== 'sale') {
      delete payload.price
    } else if (payload.price === undefined || payload.price === '') {
      delete payload.price
    }

    if (mode === 'create') {
      delete payload.status
    }

    await onSubmit(payload as ProjectFormSchema)
  }

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="mx-auto max-w-2xl space-y-5"
    >
      <ErrorMessage message={error} />

      <Input
        label="Title"
        placeholder="Project title"
        {...register('title')}
        error={errors.title?.message}
      />

      <Textarea
        label="Description"
        placeholder="Describe your project..."
        {...register('description')}
        error={errors.description?.message}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Select
          label="Type"
          options={typeOptions}
          {...register('type')}
          error={errors.type?.message}
        />
        <Select
          label="Category"
          options={categoryOptions}
          {...register('categoryId')}
          error={errors.categoryId?.message}
        />
      </div>

      {type === 'sale' && (
        <Input
          type="number"
          step="0.01"
          min="0"
          label="Price (USD)"
          placeholder="0.00"
          {...register('price', { valueAsNumber: true })}
          error={errors.price?.message}
        />
      )}

      <Input
        label="Tags"
        placeholder="e.g. pixel-art, rpg, unity (comma separated)"
        {...register('tagsString')}
        error={errors.tagsString?.message}
      />

      <Input
        label="Thumbnail URL"
        placeholder="https://..."
        {...register('thumbnailUrl')}
        error={errors.thumbnailUrl?.message}
      />

      <Input
        label="Demo URL"
        placeholder="https://..."
        {...register('demoUrl')}
        error={errors.demoUrl?.message}
      />

      {mode === 'edit' && (
        <Select
          label="Status"
          options={statusOptions}
          {...register('status')}
          error={errors.status?.message}
        />
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="ghost" to="/projects" type="button">
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
