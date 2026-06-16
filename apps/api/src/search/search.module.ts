import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SearchService } from './search.service'
import { SearchController } from './search.controller'
import { Project } from '../projects/entities/project.entity'
import { ForumThread } from '../forum/entities/forum-thread.entity'
import { MarketListing } from '../marketplace/entities/market-listing.entity'
import { User } from '../users/entities/user.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ForumThread, MarketListing, User]),
  ],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
