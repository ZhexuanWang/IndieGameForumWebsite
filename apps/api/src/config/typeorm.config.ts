import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { User } from '../users/entities/user.entity'
import { UserProfile } from '../users/entities/user-profile.entity'
import { Project } from '../projects/entities/project.entity'
import { ProjectCategory } from '../projects/entities/project-category.entity'
import { ForumCategory } from '../forum/entities/forum-category.entity'
import { ForumThread } from '../forum/entities/forum-thread.entity'
import { ForumPost } from '../forum/entities/forum-post.entity'
import { Like } from '../likes/entities/like.entity'
import { Follow } from '../follows/entities/follow.entity'

export function typeOrmConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5433', 10),
    username: process.env.DB_USER || 'flashdev',
    password: process.env.DB_PASS || 'flashdev_secret',
    database: process.env.DB_NAME || 'flashdev',
    entities: [
      User,
      UserProfile,
      ProjectCategory,
      Project,
      ForumCategory,
      ForumThread,
      ForumPost,
      Like,
      Follow,
    ],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development' ? ['error'] : false,
    extra: { max: 20, idleTimeoutMillis: 30000 },
  }
}
