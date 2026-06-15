import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message: string | null | undefined
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null
  return (
    <div className="flex items-center gap-2 rounded-lg border border-brand-rose/20 bg-brand-rose/10 px-3 py-2 text-sm text-brand-rose">
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}
