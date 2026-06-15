import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Like } from './entities/like.entity'
import { Project } from '../projects/entities/project.entity'
import { ForumThread } from '../forum/entities/forum-thread.entity'
import { LikesService } from './likes.service'
import { LikesController } from './likes.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Like, Project, ForumThread])],
  providers: [LikesService],
  controllers: [LikesController],
  exports: [LikesService],
})
export class LikesModule {}
