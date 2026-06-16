import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import type {
  MarketListing,
  MarketListingStatus,
  MarketListingType,
  PaginatedResponse,
} from '@flashdev/gameweb-shared'
import { useAuth } from '@/contexts/AuthContext'
import { marketplaceApi } from '@/lib/marketplace'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { EmptyState } from '@/components/ui/EmptyState'
import { Pagination } from '@/components/ui/Pagination'
import { ListingCard } from '@/components/marketplace/ListingCard'
import { Layout } from '@/components/layout/Layout'

const typeOptions: { value: MarketListingType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'sell', label: 'For Sale' },
  { value: 'buy', label: 'Want to Buy' },
  { value: 'promo', label: 'Promotion' },
  { value: 'host', label: 'Hosting' },
]

const statusOptions: { value: MarketListingStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'closed', label: 'Closed' },
]

export function MarketplacePage() {
  const { user } = useAuth()
  const [listings, setListings] = useState<PaginatedResponse<MarketListing> | null>(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<{
    type: MarketListingType | ''
    status: MarketListingStatus | ''
    search: string
  }>({ type: '', status: '', search: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadListings = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await marketplaceApi.listings({
        page,
        limit: 12,
        type: filters.type || undefined,
        status: filters.status || undefined,
        search: filters.search || undefined,
      })
      setListings(data)
    } catch {
      setError('Failed to load marketplace listings')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadListings()
  }, [page, filters])

  const updateFilter = (
    key: keyof typeof filters,
    value: string,
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  return (
    <Layout title="Marketplace">
      <div className="page-container">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Marketplace</h1>
            <p className="mt-1 text-ink-dim">
              Buy, sell, promote, and host indie games and services.
            </p>
          </div>
          {user && (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" to="/marketplace/inquiries">
                My Inquiries
              </Button>
              <Button size="sm" to="/marketplace/new">
                New Listing
              </Button>
            </div>
          )}
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <Input
              placeholder="Search listings..."
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
        </div>

        <ErrorMessage message={error} />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : listings?.data.length ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {listings.data.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            <div className="mt-8">
              <Pagination
                page={page}
                totalPages={listings.totalPages}
                onChange={setPage}
              />
            </div>
          </>
        ) : (
          <EmptyState
            title="No listings found"
            description="Be the first to post a listing."
            action={
              user ? (
                <Button to="/marketplace/new">New Listing</Button>
              ) : (
                <Button to="/login">Log in to post</Button>
              )
            }
          />
        )}
      </div>
    </Layout>
  )
}
