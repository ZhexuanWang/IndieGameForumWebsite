import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm'
import type { ProjectType, ProjectStatus } from '@flashdev/gameweb-shared'
import { User } from '../../users/entities/user.entity'
import type { ProjectCategory } from './project-category.entity'

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 200 })
  title: string

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'enum', enum: ['showcase', 'sale', 'custom'] })
  type: ProjectType

  @Column({
    type: 'enum',
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  })
  status: ProjectStatus

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number | null

  @Column({ type: 'simple-array', nullable: true })
  tags: string[]

  @Column({ name: 'thumbnail_url', type: 'varchar', nullable: true })
  thumbnailUrl: string | null

  @Column({ name: 'demo_url', type: 'varchar', nullable: true })
  demoUrl: string | null

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User

  @Column({ name: 'author_id' })
  authorId: string

  @ManyToOne('ProjectCategory', 'projects', { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: ProjectCategory | null

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
