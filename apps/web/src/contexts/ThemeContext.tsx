import { createContext, useContext, useEffect, useState } from 'react'
import { applyTheme, getTheme, setTheme, type Theme } from '@/lib/theme'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    const onChange = () => setThemeState(getTheme())
    window.addEventListener('flashdev:theme-changed', onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener('flashdev:theme-changed', onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [])

  const handleSetTheme = (next: Theme) => {
    setTheme(next)
    setThemeState(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
