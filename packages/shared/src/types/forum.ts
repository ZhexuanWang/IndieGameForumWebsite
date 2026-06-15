export interface ForumCategory {
  id: string
  name: string
  slug: string
  description: string | null
  displayOrder: number
  createdAt: string
}

export interface ForumThread {
  id: string
  title: string
  body: string
  pinned: boolean
  viewCount: number
  replyCount: number
  authorId: string
  author: {
    id: string
    email: string
    displayName: string | null
    role: string
  }
  categoryId: string | null
  category: ForumCategory | null
  createdAt: string
  updatedAt: string
}

export interface ForumPost {
  id: string
  content: string
  threadId: string
  authorId: string
  author: {
    id: string
    email: string
    displayName: string | null
    role: string
  }
  parentId: string | null
  depth: number
  createdAt: string
  updatedAt: string
}

export interface CreateThreadDto {
  title: string
  body: string
  categoryId?: string
}

export interface CreatePostDto {
  content: string
  parentId?: string
}
