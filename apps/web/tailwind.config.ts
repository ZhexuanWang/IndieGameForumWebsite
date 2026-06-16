import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void: '#0c0a14',
        deep: '#130f1c',
        surface: {
          0: '#130f1c',
          1: '#1c1828',
          2: '#252236',
          3: '#2c283f',
        },
        brand: {
          cyan: '#f97316',
          violet: '#3b82f6',
          teal: '#22c55e',
          amber: '#f59e0b',
          rose: '#dc2626',
          orange: '#ea580c',
        },
        ink: {
          DEFAULT: '#f1f1f4',
          dim: '#a7a3b5',
          muted: '#6f6b82',
        },
        edge: {
          DEFAULT: '#282536',
          strong: '#363247',
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
        glow: '0 0 24px rgba(249, 115, 22, 0.22)',
        'glow-lg': '0 0 40px rgba(249, 115, 22, 0.35)',
        card: '0 4px 12px rgba(0, 0, 0, 0.35)',
        'card-lg': '0 12px 40px rgba(0, 0, 0, 0.45)',
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
