import type { ProjectType, ProjectStatus } from './project'
import type { MarketListingType, MarketListingStatus } from './marketplace'
import type { UserRole } from './user'

export interface SearchProjectResult {
  id: string
  title: string
  type: ProjectType
  status: ProjectStatus
  authorId: string
  authorName: string
}

export interface SearchThreadResult {
  id: string
  title: string
  categoryId: string | null
  categoryName: string | null
  authorId: string
  authorName: string
}

export interface SearchListingResult {
  id: string
  title: string
  type: MarketListingType
  status: MarketListingStatus
  sellerId: string
  sellerName: string
}

export interface SearchUserResult {
  id: string
  email: string
  displayName: string | null
  role: UserRole
}

export interface SearchResults {
  query: string
  projects: SearchProjectResult[]
  threads: SearchThreadResult[]
  listings: SearchListingResult[]
  users: SearchUserResult[]
}
