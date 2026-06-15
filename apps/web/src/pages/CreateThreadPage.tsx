import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ForumCategory } from '@flashdev/gameweb-shared'
import { forumApi } from '@/lib/forum'
import { createThreadSchema, type CreateThreadSchema } from '@/lib/validation'
import { Layout } from '@/components/layout/Layout'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

export function CreateThreadPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateThreadSchema>({
    resolver: zodResolver(createThreadSchema),
    defaultValues: { categoryId: '' },
  })

  useEffect(() => {
    forumApi.categories().then(setCategories).catch(() => {})
  }, [])

  const onSubmit = async (values: CreateThreadSchema) => {
    setIsLoading(true)
    setError('')
    try {
      const payload = { ...values }
      if (payload.categoryId === '') delete payload.categoryId
      const thread = await forumApi.createThread(payload)
      navigate(`/forum/${thread.id}`)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to create thread'
      setError(message)
      setIsLoading(false)
    }
  }

  const categoryOptions = [
    { value: '', label: 'No category' },
    ...categories.map(c => ({ value: c.id, label: c.name })),
  ]

  return (
    <Layout title="New Thread">
      <div className="page-container max-w-2xl">
        <h1 className="page-title mb-6">Create New Thread</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <ErrorMessage message={error} />

          <Input
            label="Title"
            placeholder="Thread title"
            {...register('title')}
            error={errors.title?.message}
          />

          <Select
            label="Category"
            options={categoryOptions}
            {...register('categoryId')}
            error={errors.categoryId?.message}
          />

          <Textarea
            label="Body"
            placeholder="What's on your mind?"
            rows={8}
            {...register('body')}
            error={errors.body?.message}
          />

          <div className="flex justify-end gap-3">
            <Button variant="ghost" to="/forum" type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Post Thread
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
