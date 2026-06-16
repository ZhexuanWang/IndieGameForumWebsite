// Unified theme system for FlashDev GameWeb.
// Mirrors the flashdev-spa reference themes:
//   - flashdev       (default dark luxury + orange accent)
//   - cyberpunk      (deep navy + cyan accent)
//   - dreamy-future  (deep purple + violet accent)

export type Theme = 'flashdev' | 'cyberpunk' | 'dreamy-future'

export const THEMES: Theme[] = ['flashdev', 'cyberpunk', 'dreamy-future']

const THEME_KEY = 'flashdev-gameweb.theme'

const LEGACY_MAP: Record<string, Theme> = {
  dark: 'flashdev',
  light: 'flashdev',
  default: 'flashdev',
}

function isTheme(v: unknown): v is Theme {
  return v === 'flashdev' || v === 'cyberpunk' || v === 'dreamy-future'
}

export function getTheme(): Theme {
  try {
    const raw = localStorage.getItem(THEME_KEY)
    if (isTheme(raw)) return raw
    if (raw && raw in LEGACY_MAP) return LEGACY_MAP[raw]
  } catch { /* localStorage may be unavailable */ }
  return 'flashdev'
}

export const THEME_META: Record<Theme, {
  label: string
  hint: string
  swatch: [string, string, string]
}> = {
  flashdev: {
    label: 'FlashDev',
    hint: 'Dark luxury',
    swatch: ['#f97316', '#f1f1f4', '#130f1c'],
  },
  cyberpunk: {
    label: 'Cyberpunk',
    hint: 'Neon cyan',
    swatch: ['#00d4d9', '#03060d', '#00b1b5'],
  },
  'dreamy-future': {
    label: 'Dreamy Future',
    hint: 'Soft violet',
    swatch: ['#a170eb', '#0e0e27', '#8a5fc9'],
  },
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
}

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch { /* ignore */ }
  applyTheme(theme)
  window.dispatchEvent(new CustomEvent<Theme>('flashdev:theme-changed', { detail: theme }))
}
