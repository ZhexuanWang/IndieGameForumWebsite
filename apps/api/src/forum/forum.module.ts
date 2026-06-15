import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ForumCategory } from './entities/forum-category.entity'
import { ForumThread } from './entities/forum-thread.entity'
import { ForumPost } from './entities/forum-post.entity'
import { ForumService } from './forum.service'
import { ForumController } from './forum.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ForumCategory, ForumThread, ForumPost])],
  providers: [ForumService],
  controllers: [ForumController],
  exports: [ForumService],
})
export class ForumModule {}
