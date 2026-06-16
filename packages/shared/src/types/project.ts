export type ProjectType = 'showcase' | 'sale' | 'custom'
export type ProjectStatus = 'draft' | 'published' | 'archived'

export interface ProjectCategory {
  id: string
  name: string
  slug: string
  createdAt: string
}

export interface Project {
  id: string
  title: string
  description: string
  type: ProjectType
  categoryId: string
  authorId: string
  price: number | null
  status: ProjectStatus
  tags: string[]
  thumbnailUrl: string | null
  demoUrl: string | null
  files?: ProjectFile[]
  createdAt: string
  updatedAt: string
}

export interface ProjectFile {
  id: string
  projectId: string
  originalName: string
  filename: string
  mimeType: string
  size: number
  fileUrl: string
  version: string | null
  createdAt: string
}
