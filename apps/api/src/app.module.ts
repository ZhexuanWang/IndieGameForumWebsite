import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmConfig } from './config/typeorm.config'
import { HealthModule } from './health/health.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { ProjectsModule } from './projects/projects.module'
import { ForumModule } from './forum/forum.module'
import { LikesModule } from './likes/likes.module'
import { FollowsModule } from './follows/follows.module'
import { SeedModule } from './seed/seed.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig()),
    HealthModule,
    UsersModule,
    AuthModule,
    ProjectsModule,
    ForumModule,
    LikesModule,
    FollowsModule,
    SeedModule,
  ],
})
export class AppModule {}
