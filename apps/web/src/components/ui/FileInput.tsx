import { useState, useRef } from 'react'
import { Upload, X, File as FileIcon } from 'lucide-react'
import { uploadsApi, type UploadResult } from '@/lib/uploads'
import { Button } from './Button'
import { LoadingSpinner } from './LoadingSpinner'

interface FileInputProps {
  label?: string
  accept?: string
  currentUrl?: string
  currentName?: string
  preview?: boolean
  inputTestId?: string
  onUpload: (result: UploadResult) => void
  onClear?: () => void
  error?: string
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}

export function FileInput({
  label,
  accept,
  currentUrl,
  currentName,
  preview = false,
  inputTestId,
  onUpload,
  onClear,
  error,
}: FileInputProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    setUploadError('')
    try {
      const result = await uploadsApi.upload(file)
      onUpload(result)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Upload failed'
      setUploadError(message)
    } finally {
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const displayError = error || uploadError

  return (
    <div>
      {label && <label className="label">{label}</label>}

      {currentUrl ? (
        <div className="rounded-lg border border-edge bg-surface-0 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              {preview && currentUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                <img
                  src={currentUrl}
                  alt={currentName || 'Preview'}
                  className="h-16 w-16 rounded-md object-cover ring-1 ring-edge"
                />
              ) : (
                <FileIcon className="h-8 w-8 text-ink-muted" />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">
                  {currentName || currentUrl.split('/').pop()}
                </p>
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-brand-cyan hover:underline"
                >
                  View file
                </a>
              </div>
            </div>
            {onClear && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setUploadError('')
                  onClear()
                }}
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-edge bg-surface-0 px-4 py-8 hover:border-brand-cyan/50">
          <input
            ref={inputRef}
            data-testid={inputTestId}
            type="file"
            accept={accept}
            onChange={handleChange}
            disabled={isUploading}
            className="hidden"
          />
          {isUploading ? (
            <LoadingSpinner size="md" />
          ) : (
            <>
              <Upload className="mb-2 h-6 w-6 text-ink-muted" />
              <span className="text-sm text-ink-dim">
                Click to upload a file
              </span>
              <span className="mt-1 text-xs text-ink-muted">
                {accept ? `Accepted: ${accept}` : 'Any allowed file type'}
              </span>
            </>
          )}
        </label>
      )}

      {displayError && <p className="mt-1 text-xs text-brand-rose">{displayError}</p>}
    </div>
  )
}

export { formatBytes }
