import { Link } from 'react-router-dom'
import type { Inquiry } from '@flashdev/gameweb-shared'
import { Select } from '@/components/ui/Select'

interface InquiryRowProps {
  inquiry: Inquiry
  showListing?: boolean
  onStatusChange?: (status: string) => void
  canUpdate?: boolean
}

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'replied', label: 'Replied' },
  { value: 'closed', label: 'Closed' },
]

const statusColor: Record<string, string> = {
  pending: 'text-brand-amber',
  replied: 'text-brand-teal',
  closed: 'text-ink-muted',
}

export function InquiryRow({
  inquiry,
  showListing,
  onStatusChange,
  canUpdate,
}: InquiryRowProps) {
  return (
    <div className="rounded-lg border border-edge bg-surface-0 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-ink-dim">
          from {inquiry.sender.displayName ?? inquiry.sender.email}
        </span>
        <span className="text-xs text-ink-muted">
          {new Date(inquiry.createdAt).toLocaleString()}
        </span>
      </div>
      {showListing && inquiry.listing && (
        <Link
          to={`/marketplace/${inquiry.listingId}`}
          className="mt-1 block text-sm font-medium text-brand-cyan hover:underline"
        >
          {inquiry.listing.title}
        </Link>
      )}
      <p className="mt-2 whitespace-pre-wrap text-sm text-ink-dim">
        {inquiry.message}
      </p>
      <div className="mt-3 flex items-center gap-3">
        {canUpdate ? (
          <Select
            value={inquiry.status}
            options={statusOptions}
            onChange={e => onStatusChange?.(e.target.value)}
            className="w-32"
          />
        ) : (
          <span className={`text-xs font-medium uppercase ${statusColor[inquiry.status]}`}>
            {inquiry.status}
          </span>
        )}
      </div>
    </div>
  )
}
