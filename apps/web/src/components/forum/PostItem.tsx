import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, Trash2 } from 'lucide-react'
import type { ForumPost } from '@flashdev/gameweb-shared'
import { useAuth } from '@/contexts/AuthContext'
import { forumApi } from '@/lib/forum'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { ReplyList } from './ReplyList'

interface PostItemProps {
  post: ForumPost
  threadId: string
  onReply?: () => void
  onDelete?: () => void
}

export function PostItem({ post, threadId, onReply, onDelete }: PostItemProps) {
  const { user } = useAuth()
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [replyRefreshKey, setReplyRefreshKey] = useState(0)
  const canDelete =
    user &&
    (post.authorId === user.id ||
      user.role === 'admin' ||
      user.role === 'company')

  const handleReply = async () => {
    if (!replyContent.trim()) return
    setIsSubmitting(true)
    setError('')
    try {
      await forumApi.createPost(threadId, {
        content: replyContent,
        parentId: post.id,
      })
      setReplyContent('')
      setShowReplyForm(false)
      setReplyRefreshKey(k => k + 1)
      onReply?.()
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to post reply'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return
    try {
      await forumApi.deletePost(post.id)
      onDelete?.()
    } catch {
      setError('Failed to delete post')
    }
  }

  return (
    <div className="border-b border-edge py-4 last:border-b-0">
      <div className="flex gap-3">
        <Link to={`/users/${post.authorId}`}>
          <Avatar
            url={null}
            name={post.author.displayName ?? post.author.email}
            size="md"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              to={`/users/${post.authorId}`}
              className="font-medium text-ink hover:text-brand-cyan"
            >
              {post.author.displayName ?? post.author.email}
            </Link>
            <span className="text-ink-muted">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="mt-2 whitespace-pre-wrap text-ink-dim">
            {post.content}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {post.depth < 2 && user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <MessageSquare className="h-4 w-4" />
                Reply
              </Button>
            )}
            {canDelete && (
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 text-brand-rose" />
                Delete
              </Button>
            )}
          </div>

          {showReplyForm && (
            <div className="mt-3 rounded-lg border border-edge bg-surface-0 p-3">
              <ErrorMessage message={error} />
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                className="mb-2"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  isLoading={isSubmitting}
                  onClick={handleReply}
                >
                  Post Reply
                </Button>
              </div>
            </div>
          )}

          {post.depth < 2 && (
            <ReplyList
              postId={post.id}
              threadId={threadId}
              refreshKey={replyRefreshKey}
            />
          )}
        </div>
      </div>
    </div>
  )
}
