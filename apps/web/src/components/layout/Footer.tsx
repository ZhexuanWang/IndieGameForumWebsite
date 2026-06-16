import { Gamepad2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-edge bg-surface-0 py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[2fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2 text-ink">
              <Gamepad2 className="h-6 w-6 text-brand-cyan" />
              <span className="font-display text-lg font-bold">FlashDev</span>
            </div>
            <p className="mt-3 max-w-[280px] text-sm leading-relaxed text-ink-muted">
              The all-in-one platform for indie game developers. Design,
              develop, share, trade, and host your games.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-ink">Explore</h4>
            <div className="flex flex-col gap-1.5">
              <Link to="/projects" className="text-sm text-ink-muted transition-colors hover:text-ink">
                Project Plaza
              </Link>
              <Link to="/forum" className="text-sm text-ink-muted transition-colors hover:text-ink">
                Discussions
              </Link>
              <Link to="/marketplace" className="text-sm text-ink-muted transition-colors hover:text-ink">
                Marketplace
              </Link>
              <Link to="/search" className="text-sm text-ink-muted transition-colors hover:text-ink">
                Search
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-ink">Services</h4>
            <div className="flex flex-col gap-1.5">
              <Link to="/projects/new" className="text-sm text-ink-muted transition-colors hover:text-ink">
                Project Hosting
              </Link>
              <Link to="/marketplace" className="text-sm text-ink-muted transition-colors hover:text-ink">
                Ads & Promo
              </Link>
              <Link to="/marketplace" className="text-sm text-ink-muted transition-colors hover:text-ink">
                Source Trading
              </Link>
              <Link to="/profile" className="text-sm text-ink-muted transition-colors hover:text-ink">
                Dev Certification
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-ink">About</h4>
            <div className="flex flex-col gap-1.5">
              <a
                href="https://github.com/ZhexuanWang/IndieGameForumWebsite"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-ink-muted transition-colors hover:text-ink"
              >
                GitHub
              </a>
              <span className="text-sm text-ink-muted">Terms</span>
              <span className="text-sm text-ink-muted">Privacy</span>
              <span className="text-sm text-ink-muted">Contact</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-edge pt-5 text-xs text-ink-muted sm:flex-row">
          <span>© 2024 FlashDev. All rights reserved.</span>
          <span>Indie Games, Infinite Possibilities</span>
        </div>
      </div>
    </footer>
  )
}
