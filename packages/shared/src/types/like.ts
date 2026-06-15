export type LikeTargetType = 'PROJECT' | 'FORUM_THREAD'

export interface LikeStatus {
  liked: boolean
  count: number
}

export interface UserLikes {
  projects: Array<{
    id: string
    title: string
    type: string
    status: string
    authorId: string
  }>
  threads: Array<{
    id: string
    title: string
    authorId: string
  }>
}
