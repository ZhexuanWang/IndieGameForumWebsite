import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <Layout title="Not Found">
      <div className="page-container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold text-ink">404</h1>
        <p className="mt-4 text-lg text-ink-dim">
          This page does not exist.
        </p>
        <Button to="/" className="mt-6">
          Go Home
        </Button>
      </div>
    </Layout>
  )
}
