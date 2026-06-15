import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm'
import type { UserRole, UserPermissions, UserTheme } from '@flashdev/gameweb-shared'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true, length: 255 })
  email: string

  @Column({ type: 'varchar', nullable: true, name: 'password_hash' })
  passwordHash: string | null

  @Column({ type: 'varchar', nullable: true, length: 500, name: 'avatar_url' })
  avatarUrl: string | null

  @Column({ type: 'varchar', nullable: true, length: 255, name: 'display_name' })
  displayName: string | null

  @Column({ type: 'boolean', default: false, name: 'email_verified' })
  emailVerified: boolean

  @Column({
    type: 'enum',
    enum: ['company', 'admin', 'user'],
    default: 'user',
  })
  role: UserRole

  @Column({ type: 'jsonb', default: {} })
  permissions: UserPermissions

  @Column({ type: 'varchar', length: 32, default: 'cosmos' })
  theme: UserTheme

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
