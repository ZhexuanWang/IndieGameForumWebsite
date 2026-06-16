import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { Project } from './project.entity'

@Entity('project_files')
export class ProjectFile {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'project_id' })
  projectId: string

  @ManyToOne(() => Project, project => project.files, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project

  @Column({ name: 'original_name' })
  originalName: string

  @Column()
  filename: string

  @Column({ name: 'mime_type' })
  mimeType: string

  @Column()
  size: number

  @Column({ name: 'file_url' })
  fileUrl: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  version: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
