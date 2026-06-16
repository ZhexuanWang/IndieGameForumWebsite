import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void: 'rgb(var(--void) / <alpha-value>)',
        deep: 'rgb(var(--bg) / <alpha-value>)',
        surface: {
          0: 'rgb(var(--surface-0) / <alpha-value>)',
          1: 'rgb(var(--surface-1) / <alpha-value>)',
          2: 'rgb(var(--surface-2) / <alpha-value>)',
          3: 'rgb(var(--surface-3) / <alpha-value>)',
        },
        brand: {
          cyan: 'rgb(var(--accent) / <alpha-value>)',
          violet: 'rgb(var(--info) / <alpha-value>)',
          teal: 'rgb(var(--success) / <alpha-value>)',
          amber: 'rgb(var(--warn) / <alpha-value>)',
          rose: 'rgb(var(--danger) / <alpha-value>)',
          orange: 'rgb(var(--accent-2) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--fg) / <alpha-value>)',
          dim: 'rgb(var(--dim) / <alpha-value>)',
          muted: 'rgb(var(--muted) / <alpha-value>)',
        },
        edge: {
          DEFAULT: 'rgb(var(--border) / <alpha-value>)',
          strong: 'rgb(var(--border-strong) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['"SF Pro Display"', '"Inter"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        body: ['"SF Pro Text"', '"Inter"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '16px',
        xl: '24px',
        pill: '999px',
      },
      boxShadow: {
        glow: '0 0 24px rgb(var(--accent) / 0.22)',
        'glow-lg': '0 0 40px rgb(var(--accent) / 0.35)',
        card: '0 4px 12px rgb(0 0 0 / 0.35)',
        'card-lg': '0 12px 40px rgb(0 0 0 / 0.45)',
      },
      animation: {
        'fade-up': 'fadeUp 700ms cubic-bezier(.2,.8,.2,1) both',
        'fade-in': 'fadeIn 500ms ease both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
