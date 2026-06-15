import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export function HomePage() {
  const [status, setStatus] = useState<string>('checking...')

  useEffect(() => {
    api
      .get('/health')
      .then(res => {
        setStatus(res.data.data.status as string)
      })
      .catch(() => {
        setStatus('offline')
      })
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="animate-fade-up">
        <span className="mb-4 inline-block rounded-full border border-edge bg-surface-1 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-cyan">
          v0.01 Preview
        </span>
        <h1 className="mb-4 text-4xl font-bold md:text-6xl">
          FlashDev Indie Game Forum
        </h1>
        <p className="mx-auto max-w-xl text-lg text-ink-dim">
          Design, develop, share, trade, and host indie games — all in one place.
        </p>
      </div>

      <div className="mt-10 rounded-lg border border-edge bg-surface-1 p-6 shadow-card">
        <p className="text-sm text-ink-muted">API Status</p>
        <p
          className={`mt-1 text-xl font-semibold ${
            status === 'ok' ? 'text-brand-teal' : 'text-brand-rose'
          }`}
        >
          {status === 'ok' ? 'Connected' : status}
        </p>
      </div>
    </main>
  )
}
