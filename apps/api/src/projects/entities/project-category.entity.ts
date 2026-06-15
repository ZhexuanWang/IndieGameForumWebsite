import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, OneToMany,
} from 'typeorm'
import type { Project } from './project.entity'

@Entity('project_categories')
export class ProjectCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true, length: 100 })
  name: string

  @Column({ unique: true, length: 100 })
  slug: string

  @Column({ name: 'display_order', default: 0 })
  displayOrder: number

  @OneToMany('Project', 'category')
  projects: Project[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
