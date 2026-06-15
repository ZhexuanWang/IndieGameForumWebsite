import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from '../users/users.module'
import { ProjectCategory } from '../projects/entities/project-category.entity'
import { SeedService } from './seed.service'

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([ProjectCategory])],
  providers: [SeedService],
})
export class SeedModule {}
