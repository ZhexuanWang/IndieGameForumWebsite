import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Project } from '@flashdev/gameweb-shared'
import { marketplaceApi } from '@/lib/marketplace'
import { projectsApi } from '@/lib/projects'
import {
  createListingSchema,
  type CreateListingSchema,
} from '@/lib/validation'
import { Layout } from '@/components/layout/Layout'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { useAuth } from '@/contexts/AuthContext'

const typeOptions = [
  { value: 'sell', label: 'For Sale' },
  { value: 'buy', label: 'Want to Buy' },
  { value: 'promo', label: 'Promotion' },
  { value: 'host', label: 'Hosting' },
]

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
]

export function CreateListingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateListingSchema>({
    resolver: zodResolver(createListingSchema),
    defaultValues: { type: 'sell', status: 'draft' },
  })

  const type = watch('type')

  useEffect(() => {
    if (!user) return
    projectsApi
      .list({ authorId: user.id, limit: 100 })
      .then(res => setProjects(res.data))
      .catch(() => {})
  }, [user])

  const projectOptions = [
    { value: '', label: 'No related project' },
    ...projects.map(p => ({ value: p.id, label: p.title })),
  ]

  const onSubmit = async (values: CreateListingSchema) => {
    setIsLoading(true)
    setError('')
    try {
      const payload = { ...values }
      if (payload.projectId === '') delete payload.projectId
      if (type !== 'sell') delete payload.price
      const listing = await marketplaceApi.createListing(payload)
      navigate(`/marketplace/${listing.id}`)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to create listing'
      setError(message)
      setIsLoading(false)
    }
  }

  return (
    <Layout title="New Listing">
      <div className="page-container max-w-2xl">
        <h1 className="page-title mb-6">Create Marketplace Listing</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <ErrorMessage message={error} />

          <Input
            id="title"
            label="Title"
            placeholder="Listing title"
            {...register('title')}
            error={errors.title?.message}
          />

          <Textarea
            id="description"
            label="Description"
            placeholder="Describe what you are offering or looking for..."
            {...register('description')}
            error={errors.description?.message}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Select
              id="type"
              label="Type"
              options={typeOptions}
              {...register('type')}
              error={errors.type?.message}
            />
            <Select
              id="status"
              label="Status"
              options={statusOptions}
              {...register('status')}
              error={errors.status?.message}
            />
          </div>

          {type === 'sell' && (
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              label="Price (USD)"
              placeholder="0.00"
              {...register('price', { valueAsNumber: true })}
              error={errors.price?.message}
            />
          )}

          <Select
            id="projectId"
            label="Related Project"
            options={projectOptions}
            {...register('projectId')}
            error={errors.projectId?.message}
          />

          <div className="flex justify-end gap-3">
            <Button variant="ghost" to="/marketplace" type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Create Listing
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
