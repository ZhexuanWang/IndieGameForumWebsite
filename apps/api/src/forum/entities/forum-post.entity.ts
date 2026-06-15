import {
  Entity, PrimaryGeneratedColumn, Column, Index,
  ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import type { ForumThread } from './forum-thread.entity'

@Entity('forum_posts')
@Index(['threadId', 'parentId', 'createdAt'])
export class ForumPost {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  content: string

  @ManyToOne('ForumThread', 'posts', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'thread_id' })
  thread: ForumThread

  @Column({ name: 'thread_id' })
  threadId: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User

  @Column({ name: 'author_id' })
  authorId: string

  @Column({ type: 'varchar', name: 'parent_id', nullable: true })
  parentId: string | null

  @Column({ default: 0 })
  depth: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
