import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MarketplaceController } from './marketplace.controller'
import { MarketplaceService } from './marketplace.service'
import { MarketListing } from './entities/market-listing.entity'
import { Inquiry } from './entities/inquiry.entity'
import { User } from '../users/entities/user.entity'
import { Project } from '../projects/entities/project.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MarketListing, Inquiry, User, Project])],
  controllers: [MarketplaceController],
  providers: [MarketplaceService],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
