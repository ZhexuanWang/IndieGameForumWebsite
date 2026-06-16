import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MessageSquare, Pencil, Trash2 } from 'lucide-react'
import type { Inquiry, MarketListing } from '@flashdev/gameweb-shared'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { marketplaceApi } from '@/lib/marketplace'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Textarea } from '@/components/ui/Textarea'
import { Tag } from '@/components/ui/Tag'
import { InquiryRow } from '@/components/marketplace/InquiryRow'
import { Layout } from '@/components/layout/Layout'

const typeLabel: Record<string, string> = {
  sell: 'For Sale',
  buy: 'Want to Buy',
  promo: 'Promotion',
  host: 'Hosting',
}

const typeColor: Record<string, 'cyan' | 'violet' | 'amber' | 'teal'> = {
  sell: 'cyan',
  buy: 'violet',
  promo: 'amber',
  host: 'teal',
}

const statusColor: Record<string, 'teal' | 'amber' | 'rose'> = {
  published: 'teal',
  draft: 'amber',
  closed: 'rose',
}

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [listing, setListing] = useState<MarketListing | null>(null)
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const loadListing = async () => {
    if (!id) return
    setIsLoading(true)
    setError('')
    try {
      const data = await marketplaceApi.getListing(id)
      setListing(data)
    } catch {
      setError('Listing not found')
    } finally {
      setIsLoading(false)
    }
  }

  const loadInquiries = async () => {
    if (!id || !canManage) return
    try {
      const data = await marketplaceApi.listInquiries(id)
      setInquiries(data)
    } catch {
      // silent
    }
  }

  useEffect(() => {
    loadListing()
  }, [id])

  useEffect(() => {
    loadInquiries()
  }, [id, user])

  if (!listing && !isLoading && !error) {
    return null
  }

  const canManage =
    listing &&
    user &&
    (listing.sellerId === user.id ||
      user.role === 'admin' ||
      user.role === 'company')

  const canInquire =
    listing &&
    user &&
    listing.status === 'published' &&
    listing.sellerId !== user.id

  const handleInquiry = async () => {
    if (!id || !message.trim()) return
    setIsSubmitting(true)
    setError('')
    try {
      await marketplaceApi.createInquiry(id, { message })
      setMessage('')
      showToast('Inquiry sent', 'success')
      loadListing()
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to send inquiry'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!listing || !window.confirm('Delete this listing?')) return
    try {
      await marketplaceApi.deleteListing(listing.id)
      showToast('Listing deleted', 'success')
      navigate('/marketplace')
    } catch {
      setError('Failed to delete listing')
      showToast('Failed to delete listing', 'error')
    }
  }

  const handleStatusChange = async (inquiryId: string, status: string) => {
    try {
      await marketplaceApi.updateInquiryStatus(inquiryId, {
        status: status as Inquiry['status'],
      })
      loadInquiries()
    } catch {
      setError('Failed to update inquiry status')
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
      <Layout title="Not Found">
        <div className="page-container">
          <ErrorMessage message={error || 'Listing not found'} />
          <Button variant="ghost" to="/marketplace" className="mt-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={listing.title}>
      <div className="page-container max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" to="/marketplace">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {canManage && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                to={`/marketplace/${listing.id}/edit`}
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
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Tag color={typeColor[listing.type]}>{typeLabel[listing.type]}</Tag>
            <Tag color={statusColor[listing.status]}>
              {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
            </Tag>
          </div>

          <h1 className="text-2xl font-semibold text-ink">{listing.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink-dim">
            <span>
              by{' '}
              <Link
                to={`/users/${listing.sellerId}`}
                className="hover:text-brand-cyan"
              >
                {listing.seller.displayName ?? listing.seller.email}
              </Link>
            </span>
            <span>·</span>
            <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {listing.inquiryCount} inquiries
            </span>
          </div>

          {listing.project && (
            <div className="mt-4 rounded-lg border border-edge bg-surface-0 p-3">
              <p className="text-xs text-ink-muted">Related Project</p>
              <Link
                to={`/projects/${listing.project.id}`}
                className="font-medium text-brand-cyan hover:underline"
              >
                {listing.project.title}
              </Link>
            </div>
          )}

          <p className="mt-6 whitespace-pre-wrap text-ink-dim">
            {listing.description}
          </p>

          {listing.price !== null && listing.price > 0 && (
            <p className="mt-6 text-2xl font-semibold text-brand-amber">
              ${listing.price}
            </p>
          )}
        </Card>

        {canInquire && (
          <div className="mt-6 rounded-lg border border-edge bg-surface-1 p-4">
            <h2 className="mb-3 text-lg font-medium text-ink">
              Send an Inquiry
            </h2>
            <ErrorMessage message={error} />
            <Textarea
              id="inquiry-message"
              placeholder="Write your message to the seller..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="mb-3"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleInquiry}
                isLoading={isSubmitting}
                disabled={!message.trim()}
              >
                Send Inquiry
              </Button>
            </div>
          </div>
        )}

        {canManage && (
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-medium text-ink">Inquiries</h2>
            {inquiries.length ? (
              <div className="space-y-3">
                {inquiries.map(inquiry => (
                  <InquiryRow
                    key={inquiry.id}
                    inquiry={inquiry}
                    canUpdate
                    onStatusChange={status =>
                      handleStatusChange(inquiry.id, status)
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="text-ink-muted">No inquiries yet.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
