import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-ink-muted">
        <Inbox className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-medium text-ink">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-ink-dim">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
