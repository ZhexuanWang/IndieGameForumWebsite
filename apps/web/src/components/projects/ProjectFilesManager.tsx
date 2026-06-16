import { useState } from 'react'
import { Trash2, Upload } from 'lucide-react'
import type { ProjectFile } from '@flashdev/gameweb-shared'
import { projectsApi } from '@/lib/projects'
import { uploadsApi } from '@/lib/uploads'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { formatBytes } from '@/components/ui/FileInput'

interface ProjectFilesManagerProps {
  projectId: string
  files: ProjectFile[]
  onChange: () => void
}

export function ProjectFilesManager({
  projectId,
  files,
  onChange,
}: ProjectFilesManagerProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [version, setVersion] = useState('')
  const [error, setError] = useState('')

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    setError('')
    try {
      const upload = await uploadsApi.upload(file)
      await projectsApi.addFile(projectId, {
        url: upload.url,
        originalName: upload.originalName,
        mimeType: upload.mimeType,
        size: upload.size,
        version: version.trim() || null,
      })
      setVersion('')
      onChange()
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to upload file'
      setError(message)
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async (fileId: string) => {
    if (!window.confirm('Delete this file?')) return
    try {
      await projectsApi.removeFile(projectId, fileId)
      onChange()
    } catch {
      setError('Failed to delete file')
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-ink">Project Files</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-edge bg-surface-0 px-4 py-6 hover:border-brand-cyan/50">
            <input
              data-testid="project-file-input"
              type="file"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
            {isUploading ? (
              <LoadingSpinner size="md" />
            ) : (
              <>
                <Upload className="mb-2 h-5 w-5 text-ink-muted" />
                <span className="text-sm text-ink-dim">Upload project file</span>
                <span className="mt-1 text-xs text-ink-muted">
                  Archives, images, PDFs up to 50 MB
                </span>
              </>
            )}
          </label>
        </div>
        <Input
          label="Version (optional)"
          placeholder="e.g. v1.0.0"
          value={version}
          onChange={e => setVersion(e.target.value)}
          disabled={isUploading}
        />
      </div>

      {error && <p className="text-xs text-brand-rose">{error}</p>}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map(file => (
            <div
              key={file.id}
              className="flex items-center justify-between rounded-lg border border-edge bg-surface-0 p-3"
            >
              <div className="min-w-0">
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block truncate text-sm font-medium text-brand-cyan hover:underline"
                >
                  {file.originalName}
                </a>
                <p className="text-xs text-ink-muted">
                  {formatBytes(file.size)}
                  {file.version ? ` · ${file.version}` : ''}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(file.id)}
                type="button"
              >
                <Trash2 className="h-4 w-4 text-brand-rose" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
