import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { Like, type LikeTargetType } from './entities/like.entity'
import { Project } from '../projects/entities/project.entity'
import { ForumThread } from '../forum/entities/forum-thread.entity'

const AUTHOR_SELECT = { id: true, email: true, displayName: true, role: true } as const

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like) private readonly likeRepo: Repository<Like>,
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    @InjectRepository(ForumThread) private readonly threadRepo: Repository<ForumThread>,
  ) {}

  async toggle(userId: string, targetType: LikeTargetType, targetId: string) {
    const existing = await this.likeRepo.findOne({ where: { userId, targetType, targetId } })
    if (existing) {
      await this.likeRepo.remove(existing)
    } else {
      await this.likeRepo.save(this.likeRepo.create({ userId, targetType, targetId }))
    }
    const count = await this.likeRepo.count({ where: { targetType, targetId } })
    return { liked: !existing, count }
  }

  async getStatus(userId: string | null, targetType: LikeTargetType, targetId: string) {
    const count = await this.likeRepo.count({ where: { targetType, targetId } })
    if (!userId) return { liked: false, count }
    const existing = await this.likeRepo.findOne({ where: { userId, targetType, targetId } })
    return { liked: !!existing, count }
  }

  async getLikedItems(userId: string) {
    const likes = await this.likeRepo.find({ where: { userId }, order: { createdAt: 'DESC' } })

    const projectIds = likes.filter(l => l.targetType === 'PROJECT').map(l => l.targetId)
    const threadIds = likes.filter(l => l.targetType === 'FORUM_THREAD').map(l => l.targetId)

    const [projects, threads] = await Promise.all([
      projectIds.length
        ? this.projectRepo.find({
            where: { id: In(projectIds) },
            relations: { author: true, category: true },
            select: { author: AUTHOR_SELECT },
          })
        : [],
      threadIds.length
        ? this.threadRepo
            .createQueryBuilder('t')
            .leftJoin('t.author', 'a')
            .addSelect(['a.id', 'a.email', 'a.displayName', 'a.role'])
            .leftJoinAndSelect('t.category', 'c')
            .whereInIds(threadIds)
            .getMany()
        : [],
    ])

    return { projects, threads }
  }
}
