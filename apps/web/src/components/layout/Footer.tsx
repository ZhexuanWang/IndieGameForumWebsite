import { Gamepad2 } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-edge bg-surface-0 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 text-ink">
          <Gamepad2 className="h-5 w-5 text-brand-cyan" />
          <span className="font-display font-medium">FlashDev</span>
        </div>
        <p className="text-sm text-ink-muted">
          A community for indie game developers.
        </p>
        <a
          href="https://github.com/ZhexuanWang/IndieGameForumWebsite"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-ink-dim hover:text-ink"
        >
          GitHub
        </a>
      </div>
    </footer>
  )
}
