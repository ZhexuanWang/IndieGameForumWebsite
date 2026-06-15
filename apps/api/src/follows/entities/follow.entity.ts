import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm'

@Entity('follows')
@Index(['followerId', 'followingId'], { unique: true })
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'follower_id' })
  followerId: string

  @Column({ name: 'following_id' })
  followingId: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
