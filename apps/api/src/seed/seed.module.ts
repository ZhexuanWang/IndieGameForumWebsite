import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from '../users/users.module'
import { ProjectCategory } from '../projects/entities/project-category.entity'
import { Project } from '../projects/entities/project.entity'
import { ForumCategory } from '../forum/entities/forum-category.entity'
import { ForumThread } from '../forum/entities/forum-thread.entity'
import { ForumPost } from '../forum/entities/forum-post.entity'
import { MarketListing } from '../marketplace/entities/market-listing.entity'
import { Inquiry } from '../marketplace/entities/inquiry.entity'
import { SeedService } from './seed.service'

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      ProjectCategory,
      Project,
      ForumCategory,
      ForumThread,
      ForumPost,
      MarketListing,
      Inquiry,
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
