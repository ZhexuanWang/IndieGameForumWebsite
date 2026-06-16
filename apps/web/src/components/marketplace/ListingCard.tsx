import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import type { MarketListing } from '@flashdev/gameweb-shared'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'

interface ListingCardProps {
  listing: MarketListing
}

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

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link to={`/marketplace/${listing.id}`}>
      <Card className="h-full hover:border-brand-cyan/30">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Tag color={typeColor[listing.type]}>{typeLabel[listing.type]}</Tag>
          <Tag color={statusColor[listing.status]}>
            {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
          </Tag>
        </div>
        <h3 className="text-lg font-medium text-ink">{listing.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-dim">
          {listing.description}
        </p>
        <div className="mt-3 flex items-center justify-between text-xs text-ink-muted">
          <span>by {listing.seller.displayName ?? listing.seller.email}</span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            {listing.inquiryCount}
          </span>
        </div>
        {listing.price !== null && listing.price > 0 && (
          <p className="mt-2 text-sm font-medium text-brand-amber">
            ${listing.price}
          </p>
        )}
      </Card>
    </Link>
  )
}
