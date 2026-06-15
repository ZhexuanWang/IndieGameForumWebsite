import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { PublicUser, User } from '@flashdev/gameweb-shared'
import { useAuth } from '@/contexts/AuthContext'
import { usersApi } from '@/lib/users'
import { followsApi } from '@/lib/follows'
import { Layout } from '@/components/layout/Layout'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { FollowButton } from '@/components/social/FollowButton'
import { Tag } from '@/components/ui/Tag'

export function ProfilePage() {
  const { user: currentUser } = useAuth()
  const { id } = useParams<{ id: string }>()
  const isOwnProfile = !id || id === currentUser?.id
  const [user, setUser] = useState<User | PublicUser | null>(currentUser)
  const [counts, setCounts] = useState({ followers: 0, following: 0 })
  const [isLoading, setIsLoading] = useState(!isOwnProfile)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOwnProfile) {
      setUser(currentUser)
      setIsLoading(false)
      return
    }
    if (!id) return
    setIsLoading(true)
    usersApi
      .get(id)
      .then(data => {
        setUser(data)
        return Promise.all([
          followsApi.followers(data.id),
          followsApi.following(data.id),
        ])
      })
      .then(([followers, following]) => {
        setCounts({ followers: followers.length, following: following.length })
      })
      .catch(() => setError('User not found'))
      .finally(() => setIsLoading(false))
  }, [id, currentUser, isOwnProfile])

  useEffect(() => {
    if (!user) return
    Promise.all([
      followsApi.followers(user.id),
      followsApi.following(user.id),
    ])
      .then(([followers, following]) => {
        setCounts({ followers: followers.length, following: following.length })
      })
      .catch(() => {})
  }, [user?.id])

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    )
  }

  if (!user) {
    return (
      <Layout title="Not Found">
        <div className="page-container">
          <ErrorMessage message={error || 'Profile not found'} />
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={user.displayName ?? user.email}>
      <div className="page-container max-w-3xl">
        <Card className="border-edge-strong">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <Avatar
              url={user.avatarUrl}
              name={user.displayName ?? user.email}
              size="lg"
            />
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-semibold text-ink">
                {user.displayName ?? user.email}
              </h1>
              {user.displayName && (
                <p className="text-sm text-ink-muted">{user.email}</p>
              )}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Tag color="cyan">{user.role}</Tag>
                {user.emailVerified && <Tag color="teal">Verified</Tag>}
              </div>
              <p className="mt-3 text-sm text-ink-dim">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                <div className="text-center">
                  <p className="text-lg font-semibold text-ink">
                    {counts.followers}
                  </p>
                  <p className="text-xs text-ink-muted">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-ink">
                    {counts.following}
                  </p>
                  <p className="text-xs text-ink-muted">Following</p>
                </div>
                {!isOwnProfile && <FollowButton userId={user.id} />}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
