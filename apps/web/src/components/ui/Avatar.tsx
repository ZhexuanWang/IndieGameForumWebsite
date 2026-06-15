interface AvatarProps {
  url?: string | null
  name?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-xl',
}

export function Avatar({ url, name, size = 'md', className = '' }: AvatarProps) {
  const fallback = name ? name.slice(0, 2).toUpperCase() : '?'

  if (url) {
    return (
      <img
        src={url}
        alt={name ?? 'Avatar'}
        className={`rounded-full object-cover ring-2 ring-edge ${sizeMap[size]} ${className}`}
      />
    )
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-surface-2 font-medium text-ink-dim ring-2 ring-edge ${sizeMap[size]} ${className}`}
    >
      {fallback}
    </div>
  )
}
