import { Link } from 'react-router-dom'
import { MessageSquare, Pin } from 'lucide-react'
import type { ForumCategory, ForumThread } from '@flashdev/gameweb-shared'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'

interface ThreadRowProps {
  thread: ForumThread
  category?: ForumCategory
}

export function ThreadRow({ thread, category }: ThreadRowProps) {
  return (
    <Link to={`/forum/${thread.id}`}>
      <Card className="hover:border-brand-cyan/30">
        <div className="flex items-start gap-3">
          {thread.pinned && (
            <Pin className="mt-1 h-4 w-4 shrink-0 text-brand-amber" />
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-medium text-ink">{thread.title}</h3>
            <p className="mt-0.5 line-clamp-1 text-sm text-ink-dim">
              {thread.body}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
              {category && <Tag color="violet">{category.name}</Tag>}
              <span>by {thread.author.displayName ?? thread.author.email}</span>
              <span>·</span>
              <span>{new Date(thread.updatedAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {thread.replyCount}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
