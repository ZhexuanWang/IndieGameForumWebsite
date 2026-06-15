import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, JoinColumn,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import type { ForumCategory } from './forum-category.entity'
import type { ForumPost } from './forum-post.entity'

@Entity('forum_threads')
export class ForumThread {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 300 })
  title: string

  @Column({ type: 'text' })
  body: string

  @Column({ default: false })
  pinned: boolean

  @Column({ name: 'view_count', default: 0 })
  viewCount: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User

  @Column({ name: 'author_id' })
  authorId: string

  @ManyToOne('ForumCategory', { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: ForumCategory | null

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId: string | null

  @OneToMany('ForumPost', 'thread', { cascade: true })
  posts: ForumPost[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
