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
import { MarketListing } from './market-listing.entity'
import type { InquiryStatus } from '@flashdev/gameweb-shared'

@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'listing_id' })
  listingId: string

  @ManyToOne(() => MarketListing, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listing_id' })
  listing: MarketListing

  @Column({ name: 'sender_id' })
  senderId: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender: User

  @Column({ type: 'text' })
  message: string

  @Column({
    type: 'enum',
    enum: ['pending', 'replied', 'closed'],
    default: 'pending',
  })
  status: InquiryStatus

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
