import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Follow } from './entities/follow.entity'

@Injectable()
export class FollowsService {
  constructor(@InjectRepository(Follow) private readonly followRepo: Repository<Follow>) {}

  async toggle(followerId: string, followingId: string) {
    if (followerId === followingId) {
      return { following: false, count: await this.followerCount(followingId) }
    }

    const existing = await this.followRepo.findOne({ where: { followerId, followingId } })
    if (existing) {
      await this.followRepo.remove(existing)
    } else {
      await this.followRepo.save(this.followRepo.create({ followerId, followingId }))
    }

    const count = await this.followerCount(followingId)
    return { following: !existing, count }
  }

  async isFollowing(followerId: string | null, followingId: string) {
    if (!followerId) return { following: false }
    const existing = await this.followRepo.findOne({ where: { followerId, followingId } })
    return { following: !!existing }
  }

  async getFollowers(userId: string) {
    return this.followRepo.find({ where: { followingId: userId }, order: { createdAt: 'DESC' } })
  }

  async getFollowing(userId: string) {
    return this.followRepo.find({ where: { followerId: userId }, order: { createdAt: 'DESC' } })
  }

  private followerCount(userId: string) {
    return this.followRepo.count({ where: { followingId: userId } })
  }
}
