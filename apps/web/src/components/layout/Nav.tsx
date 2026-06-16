import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Gamepad2,
  Plus,
  Search,
  Shield,
  User,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-surface-2 text-ink ring-1 ring-inset ring-edge'
      : 'text-ink-muted hover:bg-surface-2 hover:text-ink'
  }`
}

export function Nav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [search, setSearch] = useState('')

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
    <header className="sticky top-0 z-50 h-[60px] border-b border-edge bg-deep/85 backdrop-blur-[16px]">
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 sm:px-6">
        <NavLink to="/" className="flex items-center gap-3 text-ink">
          <Gamepad2 className="h-7 w-7 text-brand-cyan" />
          <span className="font-display text-lg font-bold tracking-tight">
            FlashDev
          </span>
        </NavLink>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(link => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <form
          onSubmit={e => {
            e.preventDefault()
            const q = search.trim()
            if (q) navigate(`/search?q=${encodeURIComponent(q)}`)
          }}
          className="hidden items-center md:flex"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
            <input
              type="search"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-9 w-[220px] rounded-md border border-edge bg-surface py-1.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted focus:border-brand-cyan focus:outline-none focus:ring-[3px] focus:ring-brand-cyan/20"
            />
          </div>
        </form>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Button variant="primary" size="sm" to="/projects/new">
                <Plus className="h-4 w-4" />
                Publish
              </Button>
              <div className="relative">
                <button
                  data-testid="user-menu"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-md p-1.5 transition-colors hover:bg-surface-1"
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
                  <div className="absolute right-0 mt-2 w-44 rounded-[10px] border border-edge bg-surface-1 py-1 shadow-card">
                    <NavLink
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-ink-dim hover:bg-surface-2 hover:text-ink"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </NavLink>
                    {(user.role === 'admin' || user.role === 'company') && (
                      <NavLink
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-ink-dim hover:bg-surface-2 hover:text-ink"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Shield className="h-4 w-4" />
                        Admin
                      </NavLink>
                    )}
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
          className="flex flex-col gap-1 p-2 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span className="block h-0.5 w-5 rounded-sm bg-ink" />
          <span className="block h-0.5 w-5 rounded-sm bg-ink" />
          <span className="block h-0.5 w-5 rounded-sm bg-ink" />
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-edge bg-surface-0 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <form
              onSubmit={e => {
                e.preventDefault()
                const q = search.trim()
                if (q) {
                  navigate(`/search?q=${encodeURIComponent(q)}`)
                  setMobileOpen(false)
                }
              }}
              className="flex gap-2"
            >
              <input
                type="search"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input flex-1 rounded-md bg-surface-1 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="btn btn-secondary px-3"
                disabled={!search.trim()}
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className={navLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  Profile
                </NavLink>
                {(user.role === 'admin' || user.role === 'company') && (
                  <NavLink
                    to="/admin"
                    className={navLinkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    Admin
                  </NavLink>
                )}
                <button
                  onClick={handleLogout}
                  className="text-left text-sm font-medium text-brand-rose"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  Log in
                </NavLink>
                <NavLink
                  to="/register"
                  className="flex items-center gap-2 rounded-md bg-brand-cyan px-3 py-2 text-sm font-semibold text-deep"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
