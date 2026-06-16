import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Gamepad2, Menu, X, User, LogOut, Plus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'

export function Nav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const navLinks = [
    { to: '/projects', label: 'Projects' },
    { to: '/forum', label: 'Forum' },
    { to: '/marketplace', label: 'Marketplace' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-edge bg-deep/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-ink">
          <Gamepad2 className="h-6 w-6 text-brand-cyan" />
          <span className="font-display text-lg font-semibold">FlashDev</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-ink-dim transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Button variant="secondary" size="sm" to="/projects/new">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
              <div className="relative">
                <button
                  data-testid="user-menu"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-surface-1"
                >
                  <Avatar
                    url={user.avatarUrl}
                    name={user.displayName ?? user.email}
                    size="sm"
                  />
                  <span className="max-w-[120px] truncate text-sm text-ink">
                    {user.displayName ?? user.email}
                  </span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-lg border border-edge bg-surface-1 py-1 shadow-card">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-ink-dim hover:bg-surface-2 hover:text-ink"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <button
                      data-testid="logout-button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-brand-rose hover:bg-surface-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" to="/login">
                Log in
              </Button>
              <Button size="sm" to="/register">
                Sign up
              </Button>
            </>
          )}
        </div>

        <button
          className="text-ink md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-edge bg-surface-0 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-ink-dim hover:text-ink"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-sm font-medium text-ink-dim hover:text-ink"
                  onClick={() => setMobileOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-sm font-medium text-brand-rose"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-ink-dim hover:text-ink"
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-brand-cyan"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
