import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import type { ForumPost, PaginatedResponse } from '@flashdev/gameweb-shared'
import { useAuth } from '@/contexts/AuthContext'
import { forumApi } from '@/lib/forum'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Pagination } from '@/components/ui/Pagination'

interface ReplyListProps {
  postId: string
  threadId: string
  refreshKey?: number
}

export function ReplyList({ postId, refreshKey = 0 }: ReplyListProps) {
  const { user } = useAuth()
  const [replies, setReplies] = useState<PaginatedResponse<ForumPost> | null>(
    null,
  )
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const load = async () => {
    setIsLoading(true)
    try {
      const data = await forumApi.listReplies(postId, { page, limit: 5 })
      setReplies(data)
    } catch {
      // silent
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [postId, page, refreshKey])

  const handleDelete = async (replyId: string) => {
    if (!window.confirm('Delete this reply?')) return
    try {
      await forumApi.deletePost(replyId)
      load()
    } catch {
      // silent
    }
  }

  if (isLoading) {
    return (
      <div className="mt-3 pl-4">
        <LoadingSpinner size="sm" />
      </div>
    )
  }

  if (!replies?.data.length) return null

  return (
    <div className="mt-3 space-y-3 border-l-2 border-edge pl-4">
      {replies.data.map(reply => {
        const canDelete =
          user &&
          (reply.authorId === user.id ||
            user.role === 'admin' ||
            user.role === 'company')

        return (
          <div key={reply.id} className="rounded-lg bg-surface-0 p-3">
            <div className="flex gap-2">
              <Link to={`/users/${reply.authorId}`}>
                <Avatar
                  url={null}
                  name={reply.author.displayName ?? reply.author.email}
                  size="sm"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Link
                    to={`/users/${reply.authorId}`}
                    className="font-medium text-ink hover:text-brand-cyan"
                  >
                    {reply.author.displayName ?? reply.author.email}
                  </Link>
                  <span className="text-ink-muted">
                    {new Date(reply.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-ink-dim">
                  {reply.content}
                </p>
                {canDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleDelete(reply.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-brand-rose" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </div>
        )
      })}
      {replies.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={replies.totalPages}
          onChange={setPage}
        />
      )}
    </div>
  )
}
