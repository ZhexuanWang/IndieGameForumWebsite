import { useEffect, useState } from 'react'
import type { PublicUser, UserRole } from '@flashdev/gameweb-shared'
import { adminApi } from '@/lib/admin'
import { useToast } from '@/contexts/ToastContext'
import { Layout } from '@/components/layout/Layout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Pagination } from '@/components/ui/Pagination'

const roleOptions: UserRole[] = ['user', 'admin', 'company']

export function AdminPage() {
  const [users, setUsers] = useState<PublicUser[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { showToast } = useToast()

  const load = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await adminApi.users({ page, limit: 10, search: search.trim() || undefined })
      setUsers(data.data)
      setTotalPages(data.totalPages)
    } catch {
      setError('Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [page, search])

  const handleRoleChange = async (user: PublicUser, role: UserRole) => {
    try {
      await adminApi.updateRole(user.id, role)
      showToast('Role updated', 'success')
      load()
    } catch {
      setError(`Failed to update role for ${user.email}`)
      showToast('Failed to update role', 'error')
    }
  }

  return (
    <Layout title="Admin">
      <div className="page-container max-w-4xl">
        <h1 className="page-title mb-6">Admin Dashboard</h1>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Search users by email or name..."
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="flex-1"
          />
          <Button onClick={load} disabled={isLoading}>
            Search
          </Button>
        </div>

        <ErrorMessage message={error} />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {users.map(user => (
                <Card key={user.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-ink">
                      {user.displayName ?? user.email}
                    </p>
                    <p className="text-sm text-ink-dim">{user.email}</p>
                  </div>
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user, e.target.value as UserRole)}
                    className="select w-full sm:w-40"
                  >
                    {roleOptions.map(role => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
