import { Link } from 'react-router-dom'
import { Eye, Heart } from 'lucide-react'
import type { Project } from '@flashdev/gameweb-shared'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'

interface ProjectCardProps {
  project: Project
  categoryName?: string
}

const typeLabel: Record<string, string> = {
  showcase: 'Showcase',
  sale: 'For Sale',
  custom: 'Custom',
}

const typeColor: Record<string, 'cyan' | 'violet' | 'amber'> = {
  showcase: 'cyan',
  sale: 'amber',
  custom: 'violet',
}

const statusColor: Record<string, 'teal' | 'amber' | 'rose'> = {
  published: 'teal',
  draft: 'amber',
  archived: 'rose',
}

export function ProjectCard({ project, categoryName }: ProjectCardProps) {
  return (
    <Link to={`/projects/${project.id}`}>
      <Card className="h-full hover:border-brand-cyan/30">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Tag color={typeColor[project.type]}>{typeLabel[project.type]}</Tag>
              <Tag color={statusColor[project.status]}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Tag>
              {categoryName && (
                <span className="text-xs text-ink-muted">{categoryName}</span>
              )}
            </div>
            <h3 className="text-lg font-medium text-ink">{project.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-ink-dim">
              {project.description}
            </p>
          </div>
          {project.thumbnailUrl && (
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="h-20 w-20 rounded-md object-cover ring-1 ring-edge"
            />
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            by {project.authorId}
          </span>
          {project.price !== null && project.price > 0 && (
            <span className="font-medium text-brand-amber">${project.price}</span>
          )}
          {project.type === 'showcase' && (
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              Free
            </span>
          )}
        </div>

        {project.tags && project.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="rounded-pill bg-surface-2 px-2 py-0.5 text-xs text-ink-dim"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Card>
    </Link>
  )
}
