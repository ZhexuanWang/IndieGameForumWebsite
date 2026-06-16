import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Project } from '../../projects/entities/project.entity'
import type { MarketListingType, MarketListingStatus } from '@flashdev/gameweb-shared'

@Entity('market_listings')
export class MarketListing {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'enum',
    enum: ['sell', 'buy', 'promo', 'host'],
  })
  type: MarketListingType

  @Column({
    type: 'enum',
    enum: ['draft', 'published', 'closed'],
    default: 'draft',
  })
  status: MarketListingStatus

  @Column({ type: 'varchar', length: 200 })
  title: string

  @Column({ type: 'text' })
  description: string

  inquiryCount?: number

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number | null

  @Column({ name: 'seller_id' })
  sellerId: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seller_id' })
  seller: User

  @Column({ name: 'project_id', nullable: true })
  projectId: string | null

  @ManyToOne(() => Project, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'project_id' })
  project: Project | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
