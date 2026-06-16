import { useEffect } from 'react'
import { Nav } from './Nav'
import { Footer } from './Footer'
import { DynamicBackground } from '@/components/background/DynamicBackground'
import { CursorGlow } from '@/components/background/CursorGlow'

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

export function Layout({ children, title }: LayoutProps) {
  useEffect(() => {
    document.title = title ? `${title} — FlashDev` : 'FlashDev Indie Game Forum'
  }, [title])

  return (
    <>
      <DynamicBackground />
      <CursorGlow />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  )
}
