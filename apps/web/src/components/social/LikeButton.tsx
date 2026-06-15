import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import type { LikeTargetType } from '@flashdev/gameweb-shared'
import { useAuth } from '@/contexts/AuthContext'
import { likesApi } from '@/lib/likes'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface LikeButtonProps {
  targetType: LikeTargetType
  targetId: string
}

export function LikeButton({ targetType, targetId }: LikeButtonProps) {
  const { user } = useAuth()
  const [state, setState] = useState({
    liked: false,
    count: 0,
    loading: true,
  })

  useEffect(() => {
    let cancelled = false
    setState(prev => ({ ...prev, loading: true }))
    likesApi
      .status(targetType, targetId)
      .then(data => {
        if (!cancelled) setState({ ...data, loading: false })
      })
      .catch(() => {
        if (!cancelled) setState(prev => ({ ...prev, loading: false }))
      })
    return () => {
      cancelled = true
    }
  }, [targetType, targetId])

  const handleClick = async () => {
    if (!user) return
    try {
      const data = await likesApi.toggle(targetType, targetId)
      setState(prev => ({ ...prev, ...data }))
    } catch {
      // silent
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={!user || state.loading}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
        state.liked
          ? 'border-brand-rose/30 bg-brand-rose/10 text-brand-rose'
          : 'border-edge bg-surface-1 text-ink-dim hover:text-ink'
      }`}
    >
      {state.loading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <Heart
          className={`h-4 w-4 ${state.liked ? 'fill-current' : ''}`}
        />
      )}
      {state.count}
    </button>
  )
}
