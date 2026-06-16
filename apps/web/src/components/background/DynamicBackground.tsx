import { useEffect, useRef } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import type { Theme } from '@/lib/theme'

type BgType = 'cyberpunk' | 'dreamy' | 'flashdev'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
  trail?: { x: number; y: number; alpha: number }[]
  type: 'neon' | 'dream' | 'cosmic'
  pulse?: number
  pulseSpeed?: number
}

interface Ripple {
  x: number
  y: number
  r: number
  alpha: number
  maxR: number
}

const THEME_BG_TYPE: Record<Theme, BgType> = {
  flashdev: 'flashdev',
  cyberpunk: 'cyberpunk',
  'dreamy-future': 'dreamy',
}

export function DynamicBackground() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const typeRef = useRef<BgType>(THEME_BG_TYPE[theme])
  const mouseRef = useRef({ x: -1000, y: -1000, active: false })
  const particlesRef = useRef<Particle[]>([])
  const ripplesRef = useRef<Ripple[]>([])
  const rafRef = useRef<number>()

  useEffect(() => {
    typeRef.current = THEME_BG_TYPE[theme]
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const createParticle = (): Particle => {
      const type = typeRef.current
      if (type === 'cyberpunk') {
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          size: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.5 + 0.2,
          color: Math.random() > 0.5 ? '0,240,255' : '255,0,128',
          trail: [],
          type: 'neon',
        }
      }
      if (type === 'dreamy') {
        const colors = ['168,85,247', '99,102,241', '236,72,153']
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3 - 0.15,
          size: Math.random() * 3 + 1,
          alpha: Math.random() * 0.35 + 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
          type: 'dream',
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.01,
        }
      }
      // flashdev
      const colors = ['249,115,22', '167,139,250', '125,211,252']
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.15,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.35 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'cosmic',
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      }
    }

    const initParticles = () => {
      const type = typeRef.current
      const count = type === 'cyberpunk' ? 100 : 70
      particlesRef.current = Array.from({ length: count }, createParticle)
      ripplesRef.current = []
    }

    const addRipple = (x: number, y: number) => {
      const type = typeRef.current
      ripplesRef.current.push({
        x,
        y,
        r: 0,
        alpha: 0.5,
        maxR: type === 'cyberpunk' ? 100 : 160,
      })
    }

    const drawCyberpunk = () => {
      const gridSize = 50
      ctx.strokeStyle = 'rgba(0,240,255,0.035)'
      ctx.lineWidth = 1
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      const scanY = (Date.now() / 20) % h
      const grad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20)
      grad.addColorStop(0, 'rgba(0,240,255,0)')
      grad.addColorStop(0.5, 'rgba(0,240,255,0.05)')
      grad.addColorStop(1, 'rgba(0,240,255,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, scanY - 20, w, 40)

      particlesRef.current.forEach(p => {
        p.trail?.forEach((t, i) => {
          const a = (i / p.trail!.length) * t.alpha * 0.4
          ctx.beginPath()
          ctx.arc(t.x, t.y, p.size * 0.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${p.color},${a})`
          ctx.fill()
        })
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${p.alpha * 0.12})`
        ctx.fill()
      })

      ctx.strokeStyle = 'rgba(0,240,255,0.05)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i]
          const b = particlesRef.current[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
    }

    const drawDreamy = () => {
      const time = Date.now() / 3000
      const gx = w * 0.3 + Math.sin(time) * 100
      const gy = h * 0.4 + Math.cos(time * 0.7) * 80
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 500)
      g.addColorStop(0, 'rgba(99,102,241,0.07)')
      g.addColorStop(0.5, 'rgba(168,85,247,0.03)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      const g2 = ctx.createRadialGradient(w - gx, h - gy, 0, w - gx, h - gy, 400)
      g2.addColorStop(0, 'rgba(236,72,153,0.05)')
      g2.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, w, h)

      particlesRef.current.forEach(p => {
        const pulse = Math.sin(p.pulse || 0) * 0.3 + 0.7
        const size = p.size * pulse
        const alpha = p.alpha * pulse
        ctx.beginPath()
        ctx.arc(p.x, p.y, size * 5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${alpha * 0.06})`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(p.x, p.y, size * 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${alpha * 0.15})`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${alpha})`
        ctx.fill()
      })

      ctx.strokeStyle = 'rgba(168,85,247,0.03)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i]
          const b = particlesRef.current[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 160) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
    }

    const drawFlashdev = () => {
      const time = Date.now() / 3000
      const gx = w * 0.3 + Math.sin(time) * 100
      const gy = h * 0.4 + Math.cos(time * 0.7) * 80
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 500)
      g.addColorStop(0, 'rgba(249,115,22,0.07)')
      g.addColorStop(0.5, 'rgba(167,139,250,0.03)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      const g2 = ctx.createRadialGradient(w - gx, h - gy, 0, w - gx, h - gy, 400)
      g2.addColorStop(0, 'rgba(125,211,252,0.04)')
      g2.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, w, h)

      particlesRef.current.forEach(p => {
        const pulse = Math.sin(p.pulse || 0) * 0.3 + 0.7
        const size = p.size * pulse
        const alpha = p.alpha * pulse
        ctx.beginPath()
        ctx.arc(p.x, p.y, size * 5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${alpha * 0.06})`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(p.x, p.y, size * 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${alpha * 0.15})`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${alpha})`
        ctx.fill()
      })

      ctx.strokeStyle = 'rgba(249,115,22,0.03)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i]
          const b = particlesRef.current[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 160) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
    }

    const update = () => {
      const type = typeRef.current
      particlesRef.current.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (type === 'cyberpunk') {
          if (mouseRef.current.active) {
            const dx = p.x - mouseRef.current.x
            const dy = p.y - mouseRef.current.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 140 && dist > 0) {
              const force = ((140 - dist) / 140) * 0.6
              p.vx += (dx / dist) * force
              p.vy += (dy / dist) * force
            }
          }
          p.vx *= 0.98
          p.vy *= 0.98
          p.trail = p.trail || []
          p.trail.push({ x: p.x, y: p.y, alpha: p.alpha })
          if (p.trail.length > 6) p.trail.shift()
        } else {
          p.pulse = (p.pulse || 0) + (p.pulseSpeed || 0.01)
          if (mouseRef.current.active) {
            const dx = mouseRef.current.x - p.x
            const dy = mouseRef.current.y - p.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 180 && dist > 0) {
              p.vx += (dx / dist) * 0.015
              p.vy += (dy / dist) * 0.015
            }
          }
        }
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10
      })

      ripplesRef.current.forEach(r => {
        r.r += 2
        r.alpha -= 0.012
      })
      ripplesRef.current = ripplesRef.current.filter(r => r.alpha > 0)
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const type = typeRef.current
      if (type === 'cyberpunk') drawCyberpunk()
      else if (type === 'dreamy') drawDreamy()
      else drawFlashdev()

      const rippleColor =
        type === 'cyberpunk'
          ? '0,240,255'
          : type === 'dreamy'
            ? '168,85,247'
            : '249,115,22'
      ripplesRef.current.forEach(r => {
        ctx.beginPath()
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${rippleColor},${r.alpha})`
        ctx.lineWidth = 1.5
        ctx.stroke()
      })
    }

    const loop = () => {
      update()
      draw()
      rafRef.current = requestAnimationFrame(loop)
    }

    const onResize = () => {
      resize()
      initParticles()
    }
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      mouseRef.current.active = true
    }
    const onMouseLeave = () => {
      mouseRef.current.active = false
    }
    const onClick = (e: MouseEvent) => {
      addRipple(e.clientX, e.clientY)
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('click', onClick)

    resize()
    initParticles()
    loop()

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('click', onClick)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
    />
  )
}
