import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { MarketListing, Project } from '@flashdev/gameweb-shared'
import { useAuth } from '@/contexts/AuthContext'
import { marketplaceApi } from '@/lib/marketplace'
import { projectsApi } from '@/lib/projects'
import {
  updateListingSchema,
  type UpdateListingSchema,
} from '@/lib/validation'
import { Layout } from '@/components/layout/Layout'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

const typeOptions = [
  { value: 'sell', label: 'For Sale' },
  { value: 'buy', label: 'Want to Buy' },
  { value: 'promo', label: 'Promotion' },
  { value: 'host', label: 'Hosting' },
]

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'closed', label: 'Closed' },
]

export function EditListingPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listing, setListing] = useState<MarketListing | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UpdateListingSchema>({
    resolver: zodResolver(updateListingSchema),
  })

  const type = watch('type')

  useEffect(() => {
    if (!id || !user) return
    Promise.all([
      marketplaceApi.getListing(id),
      projectsApi.list({ authorId: user.id, limit: 100 }),
    ])
      .then(([listingData, projectData]) => {
        if (
          listingData.sellerId !== user.id &&
          user.role !== 'admin' &&
          user.role !== 'company'
        ) {
          setError('You do not have permission to edit this listing')
        } else {
          setListing(listingData)
          setProjects(projectData.data)
        }
      })
      .catch(() => setError('Listing not found'))
      .finally(() => setIsLoading(false))
  }, [id, user])

  const projectOptions = [
    { value: '', label: 'No related project' },
    ...projects.map(p => ({ value: p.id, label: p.title })),
  ]

  const onSubmit = async (values: UpdateListingSchema) => {
    if (!id) return
    setIsSaving(true)
    setError('')
    try {
      const payload: Record<string, unknown> = { ...values }
      if (payload.projectId === '') payload.projectId = null
      if (type && type !== 'sell') delete payload.price
      await marketplaceApi.updateListing(
        id,
        payload as UpdateListingSchema,
      )
      navigate(`/marketplace/${id}`)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to update listing'
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

  if (!listing) {
    return (
      <Layout title="Error">
        <div className="page-container">
          <ErrorMessage message={error} />
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Edit Listing">
      <div className="page-container max-w-2xl">
        <h1 className="page-title mb-6">Edit Listing</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <ErrorMessage message={error} />

          <Input
            label="Title"
            placeholder="Listing title"
            defaultValue={listing.title}
            {...register('title')}
            error={errors.title?.message}
          />

          <Textarea
            label="Description"
            placeholder="Describe what you are offering or looking for..."
            defaultValue={listing.description}
            {...register('description')}
            error={errors.description?.message}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Select
              label="Type"
              options={typeOptions}
              defaultValue={listing.type}
              {...register('type')}
              error={errors.type?.message}
            />
            <Select
              label="Status"
              options={statusOptions}
              defaultValue={listing.status}
              {...register('status')}
              error={errors.status?.message}
            />
          </div>

          <Input
            type="number"
            step="0.01"
            min="0"
            label="Price (USD)"
            placeholder="0.00"
            defaultValue={listing.price ?? undefined}
            {...register('price', { valueAsNumber: true })}
            error={errors.price?.message}
          />

          <Select
            label="Related Project"
            options={projectOptions}
            defaultValue={listing.projectId ?? ''}
            {...register('projectId')}
            error={errors.projectId?.message}
          />

          <div className="flex justify-end gap-3">
            <Button variant="ghost" to="/marketplace" type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
