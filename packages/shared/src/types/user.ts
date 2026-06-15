export type UserRole = 'company' | 'admin' | 'user'

export type UserTheme = 'cosmos' | 'light'

export interface UserPermissions {
  canManageUsers?: boolean
  canManageProjects?: boolean
  canManageCategories?: boolean
  canManageMarketplace?: boolean
  canEditSiteSettings?: boolean
  canToggleEditMode?: boolean
}

export interface User {
  id: string
  email: string
  role: UserRole
  permissions: UserPermissions
  avatarUrl: string | null
  displayName: string | null
  emailVerified: boolean
  theme: UserTheme
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
}
