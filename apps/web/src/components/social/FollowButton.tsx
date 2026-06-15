import { useEffect, useState } from 'react'
import { UserPlus, UserCheck } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { followsApi } from '@/lib/follows'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface FollowButtonProps {
  userId: string
}

export function FollowButton({ userId }: FollowButtonProps) {
  const { user } = useAuth()
  const [following, setFollowing] = useState(false)
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!user) {
      setIsLoading(false)
      return
    }
    Promise.all([
      followsApi.status(userId),
      followsApi.followers(userId),
    ])
      .then(([status, followers]) => {
        if (!cancelled) {
          setFollowing(status.following)
          setCount(followers.length)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [userId, user])

  const handleClick = async () => {
    if (!user || isSubmitting) return
    setIsSubmitting(true)
    try {
      const data = await followsApi.toggle(userId)
      setFollowing(data.following)
      setCount(data.count)
    } catch {
      // silent
    } finally {
      setIsSubmitting(false)
    }
  }

  const isSelf = user?.id === userId
  const disabled = !user || isSelf || isLoading || isSubmitting

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
        following
          ? 'border-brand-teal/30 bg-brand-teal/10 text-brand-teal'
          : 'border-edge bg-surface-1 text-ink-dim hover:text-ink'
      }`}
    >
      {isLoading || isSubmitting ? (
        <LoadingSpinner size="sm" />
      ) : following ? (
        <UserCheck className="h-4 w-4" />
      ) : (
        <UserPlus className="h-4 w-4" />
      )}
      {following ? 'Following' : 'Follow'}
      <span className="ml-1 text-xs opacity-80">{count}</span>
    </button>
  )
}
