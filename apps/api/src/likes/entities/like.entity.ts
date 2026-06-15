import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm'

export type LikeTargetType = 'PROJECT' | 'FORUM_THREAD'

@Entity('likes')
@Index(['userId', 'targetType', 'targetId'], { unique: true })
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id' })
  userId: string

  @Column({
    name: 'target_type',
    type: 'enum',
    enum: ['PROJECT', 'FORUM_THREAD'],
  })
  targetType: LikeTargetType

  @Column({ name: 'target_id' })
  targetId: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
