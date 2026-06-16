import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette } from 'lucide-react'
import { getTheme, setTheme, THEMES, THEME_META, type Theme } from '@/lib/theme'

export function ThemePicker() {
  const [current, setCurrent] = useState<Theme>(getTheme)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const onChange = () => setCurrent(getTheme())
    window.addEventListener('flashdev:theme-changed', onChange as EventListener)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener('flashdev:theme-changed', onChange as EventListener)
      window.removeEventListener('storage', onChange)
    }
  }, [])

  const choose = (theme: Theme) => {
    setTheme(theme)
    setCurrent(theme)
    setOpen(false)
  }

  const info = THEME_META[current]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label="Select theme"
        title={`Theme: ${info.label}`}
        className="flex h-9 items-center gap-1.5 rounded-md border border-edge bg-surface-1 px-2 text-ink-dim transition-all hover:border-edge-strong hover:text-ink"
      >
        <Palette className="h-4 w-4" />
        <PaletteSwatch swatch={info.swatch} />
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 3.5l3 3 3-3" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="dropdown-panel card absolute right-0 top-full z-[60] mt-2 w-56 py-1"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
          >
            <div className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
              Theme
            </div>
            {THEMES.map(t => {
              const item = THEME_META[t]
              const active = current === t
              return (
                <button
                  key={t}
                  onClick={() => choose(t)}
                  className={[
                    'flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors duration-150',
                    active
                      ? 'bg-brand-cyan/10 text-brand-cyan'
                      : 'text-ink-dim hover:bg-white/[0.04] hover:text-ink',
                  ].join(' ')}
                >
                  <PaletteSwatch swatch={item.swatch} />
                  <span className="flex-1 text-left">
                    <span className="block">{item.label}</span>
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                      {item.hint}
                    </span>
                  </span>
                  {active && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PaletteSwatch({ swatch }: { swatch: [string, string, string] }) {
  return (
    <span
      aria-hidden
      className="inline-flex h-5 w-5 flex-shrink-0 overflow-hidden rounded-full border border-edge"
      style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.05) inset' }}
    >
      <span style={{ flex: 1, background: swatch[0] }} />
      <span style={{ flex: 1, background: swatch[1] }} />
      <span style={{ flex: 1, background: swatch[2] }} />
    </span>
  )
}
