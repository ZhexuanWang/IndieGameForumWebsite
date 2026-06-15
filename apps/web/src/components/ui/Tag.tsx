interface TagProps {
  children: React.ReactNode
  color?: 'cyan' | 'violet' | 'teal' | 'amber' | 'rose'
}

const colorMap = {
  cyan: 'chip-cyan',
  violet: 'chip-violet',
  teal: 'chip-teal',
  amber: 'chip-amber',
  rose: 'chip-rose',
}

export function Tag({ children, color = 'cyan' }: TagProps) {
  return <span className={colorMap[color]}>{children}</span>
}
