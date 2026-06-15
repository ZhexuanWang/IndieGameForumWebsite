import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MessageSquare, Pin, Trash2 } from 'lucide-react'
import type {
  ForumPost,
  ForumThread,
  PaginatedResponse,
} from '@flashdev/gameweb-shared'
import { useAuth } from '@/contexts/AuthContext'
import { forumApi } from '@/lib/forum'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Textarea } from '@/components/ui/Textarea'
import { Pagination } from '@/components/ui/Pagination'
import { Avatar } from '@/components/ui/Avatar'
import { LikeButton } from '@/components/social/LikeButton'
import { PostItem } from '@/components/forum/PostItem'
import { Layout } from '@/components/layout/Layout'

export function ForumThreadPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [thread, setThread] = useState<ForumThread | null>(null)
  const [posts, setPosts] = useState<PaginatedResponse<ForumPost> | null>(null)
  const [page, setPage] = useState(1)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadThread = async () => {
    if (!id) return
    try {
      const data = await forumApi.getThread(id)
      setThread(data)
    } catch {
      setError('Thread not found')
    }
  }

  const loadPosts = async () => {
    if (!id) return
    try {
      const data = await forumApi.listPosts(id, { page, limit: 10 })
      setPosts(data)
    } catch {
      setError('Failed to load posts')
    }
  }

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    Promise.all([loadThread(), loadPosts()]).finally(() => setIsLoading(false))
  }, [id, page])

  const handleReply = async () => {
    if (!id || !replyContent.trim()) return
    setIsSubmitting(true)
    setError('')
    try {
      await forumApi.createPost(id, { content: replyContent })
      setReplyContent('')
      setPage(1)
      loadPosts()
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to post reply'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteThread = async () => {
    if (!thread || !window.confirm('Delete this thread?')) return
    try {
      await forumApi.deleteThread(thread.id)
      navigate('/forum')
    } catch {
      setError('Failed to delete thread')
    }
  }

  const canDeleteThread =
    thread &&
    user &&
    (thread.authorId === user.id ||
      user.role === 'admin' ||
      user.role === 'company')

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    )
  }

  if (!thread) {
    return (
      <Layout title="Not Found">
        <div className="page-container">
          <ErrorMessage message={error || 'Thread not found'} />
          <Button variant="ghost" to="/forum" className="mt-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Forum
          </Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={thread.title}>
      <div className="page-container max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" to="/forum">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {canDeleteThread && (
            <Button variant="danger" size="sm" onClick={handleDeleteThread}>
              <Trash2 className="h-4 w-4" />
              Delete Thread
            </Button>
          )}
        </div>

        <Card className="border-edge-strong">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {thread.pinned && (
              <span className="chip-amber inline-flex items-center gap-1">
                <Pin className="h-3 w-3" />
                Pinned
              </span>
            )}
            {thread.category && (
              <span className="chip-violet">{thread.category.name}</span>
            )}
            <span className="text-sm text-ink-muted">
              {thread.viewCount} views
            </span>
          </div>

          <h1 className="text-2xl font-semibold text-ink">{thread.title}</h1>

          <div className="mt-3 flex items-center gap-2 text-sm text-ink-dim">
            <Link
              to={`/users/${thread.authorId}`}
              className="flex items-center gap-2 hover:text-brand-cyan"
            >
              <Avatar
                url={null}
                name={thread.author.displayName ?? thread.author.email}
                size="sm"
              />
              {thread.author.displayName ?? thread.author.email}
            </Link>
            <span>·</span>
            <span>{new Date(thread.createdAt).toLocaleString()}</span>
          </div>

          <p className="mt-6 whitespace-pre-wrap text-ink-dim">{thread.body}</p>

          <div className="mt-6 flex items-center gap-3">
            <LikeButton targetType="FORUM_THREAD" targetId={thread.id} />
            <span className="inline-flex items-center gap-1 text-sm text-ink-muted">
              <MessageSquare className="h-4 w-4" />
              {thread.replyCount} replies
            </span>
          </div>
        </Card>

        <div className="mt-8">
          <h2 className="mb-4 text-lg font-medium text-ink">Replies</h2>
          <ErrorMessage message={error} />

          {user && (
            <div className="mb-6 rounded-lg border border-edge bg-surface-1 p-4">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                className="mb-3"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleReply}
                  isLoading={isSubmitting}
                  disabled={!replyContent.trim()}
                >
                  Post Reply
                </Button>
              </div>
            </div>
          )}

          {posts?.data.length ? (
            <div className="divide-y divide-edge rounded-lg border border-edge bg-surface-1 px-4">
              {posts.data.map(post => (
                <PostItem
                  key={post.id}
                  post={post}
                  threadId={thread.id}
                  onReply={() => loadPosts()}
                />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-ink-muted">
              No replies yet. Be the first to reply.
            </p>
          )}

          {posts && posts.totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                page={page}
                totalPages={posts.totalPages}
                onChange={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
