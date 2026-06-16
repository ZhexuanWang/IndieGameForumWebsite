import { useEffect, useState } from 'react'
import type { Inquiry } from '@flashdev/gameweb-shared'
import { marketplaceApi } from '@/lib/marketplace'
import { Layout } from '@/components/layout/Layout'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { EmptyState } from '@/components/ui/EmptyState'
import { InquiryRow } from '@/components/marketplace/InquiryRow'

export function MyInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await marketplaceApi.myInquiries()
      setInquiries(data)
    } catch {
      setError('Failed to load inquiries')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <Layout title="My Inquiries">
      <div className="page-container max-w-3xl">
        <h1 className="page-title mb-6">My Inquiries</h1>
        <ErrorMessage message={error} />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : inquiries.length ? (
          <div className="space-y-3">
            {inquiries.map(inquiry => (
              <InquiryRow key={inquiry.id} inquiry={inquiry} showListing />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No inquiries yet"
            description="Browse the marketplace and send a message to a seller."
          />
        )}
      </div>
    </Layout>
  )
}
