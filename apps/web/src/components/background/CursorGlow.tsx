import { useEffect, useRef } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import type { Theme } from '@/lib/theme'

const GLOW_STYLE: Record<Theme, string> = {
  flashdev:
    'radial-gradient(circle, rgba(249,115,22,0.14) 0%, rgba(167,139,250,0.05) 50%, transparent 70%)',
  cyberpunk:
    'radial-gradient(circle, rgba(0,240,255,0.12) 0%, rgba(255,0,128,0.04) 50%, transparent 70%)',
  'dreamy-future':
    'radial-gradient(circle, rgba(168,85,247,0.14) 0%, rgba(99,102,241,0.05) 50%, transparent 70%)',
}

export function CursorGlow() {
  const { theme } = useTheme()
  const elRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef({ x: -200, y: -200 })
  const posRef = useRef({ x: -200, y: -200 })
  const rafRef = useRef<number>()

  useEffect(() => {
    // Hide on touch/tablet devices
    if (window.matchMedia('(pointer: coarse)').matches) return
    const el = elRef.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX
      targetRef.current.y = e.clientY
    }

    const loop = () => {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.1
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.1
      el.style.transform = `translate(${posRef.current.x - 80}px, ${posRef.current.y - 80}px)`
      rafRef.current = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={elRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-40 w-40 rounded-full lg:block"
      style={{ background: GLOW_STYLE[theme] }}
    />
  )
}
