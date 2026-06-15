import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm'
import type { ForumThread } from './forum-thread.entity'

@Entity('forum_categories')
export class ForumCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 60 })
  name: string

  @Column({ length: 60, unique: true })
  slug: string

  @Column({ type: 'text', nullable: true })
  description: string | null

  @Column({ name: 'display_order', default: 0 })
  displayOrder: number

  @OneToMany('ForumThread', 'category')
  threads: ForumThread[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
