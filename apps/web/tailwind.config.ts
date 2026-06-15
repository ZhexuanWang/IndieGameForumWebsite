import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void: '#03040c',
        deep: '#05060f',
        surface: {
          0: '#080a18',
          1: '#0d1124',
          2: '#141833',
          3: '#1c2244',
        },
        brand: {
          cyan: '#7dd3fc',
          violet: '#a78bfa',
          teal: '#5eead4',
          amber: '#fbbf24',
          rose: '#fb7185',
          orange: '#f97316',
        },
        ink: {
          DEFAULT: '#e6edff',
          dim: '#9ba8c7',
          muted: '#5d6889',
        },
        edge: {
          DEFAULT: 'rgba(125, 211, 252, 0.08)',
          strong: 'rgba(125, 211, 252, 0.18)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        pill: '999px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(125, 211, 252, 0.3)',
        'glow-lg': '0 0 40px rgba(125, 211, 252, 0.4)',
        card: '0 30px 60px -30px rgba(0,0,0,0.6)',
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
