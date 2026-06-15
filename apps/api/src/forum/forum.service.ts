import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ForumCategory } from './entities/forum-category.entity'
import { ForumThread } from './entities/forum-thread.entity'
import { ForumPost } from './entities/forum-post.entity'
import { CreateThreadDto } from './dto/create-thread.dto'
import { CreatePostDto } from './dto/create-post.dto'
import type { UserRole } from '@flashdev/gameweb-shared'

const AUTHOR_SELECT = { id: true, email: true, displayName: true, role: true }
const MAX_DEPTH = 2

@Injectable()
export class ForumService {
  constructor(
    @InjectRepository(ForumCategory) private catRepo: Repository<ForumCategory>,
    @InjectRepository(ForumThread) private threadRepo: Repository<ForumThread>,
    @InjectRepository(ForumPost) private postRepo: Repository<ForumPost>,
  ) {}

  getCategories() {
    return this.catRepo.find({ order: { displayOrder: 'ASC' } })
  }

  async getThreads(categoryId?: string, page = 1, limit = 20, search?: string, authorId?: string) {
    const qb = this.threadRepo
      .createQueryBuilder('t')
      .leftJoin('t.author', 'a')
      .addSelect(['a.id', 'a.email', 'a.displayName', 'a.role'])
      .leftJoinAndSelect('t.category', 'c')
      .loadRelationCountAndMap('t.replyCount', 't.posts')
      .orderBy('t.pinned', 'DESC')
      .addOrderBy('t.updatedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    if (categoryId) qb.andWhere('t.categoryId = :categoryId', { categoryId })
    if (search) qb.andWhere('LOWER(t.title) LIKE :search', { search: `%${search.toLowerCase()}%` })
    if (authorId) qb.andWhere('t.authorId = :authorId', { authorId })

    const [items, total] = await qb.getManyAndCount()
    return { data: items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async getThread(id: string) {
    await this.threadRepo.increment({ id }, 'viewCount', 1)

    const thread = await this.threadRepo
      .createQueryBuilder('t')
      .leftJoin('t.author', 'a')
      .addSelect(['a.id', 'a.email', 'a.displayName', 'a.role'])
      .leftJoinAndSelect('t.category', 'c')
      .where('t.id = :id', { id })
      .getOne()

    if (!thread) throw new NotFoundException('Thread not found')
    return thread
  }

  async getThreadPosts(threadId: string, page = 1, limit = 10) {
    const thread = await this.threadRepo.findOne({ where: { id: threadId } })
    if (!thread) throw new NotFoundException('Thread not found')

    const [items, total] = await this.postRepo
      .createQueryBuilder('p')
      .leftJoin('p.author', 'a')
      .addSelect(['a.id', 'a.email', 'a.displayName', 'a.role'])
      .where('p.threadId = :threadId', { threadId })
      .andWhere('p.parentId IS NULL')
      .orderBy('p.createdAt', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    return { data: items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async getPostReplies(postId: string, page = 1, limit = 10) {
    const parent = await this.postRepo.findOne({ where: { id: postId } })
    if (!parent) throw new NotFoundException('Post not found')

    const [items, total] = await this.postRepo
      .createQueryBuilder('p')
      .leftJoin('p.author', 'a')
      .addSelect(['a.id', 'a.email', 'a.displayName', 'a.role'])
      .where('p.parentId = :postId', { postId })
      .orderBy('p.createdAt', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    return { data: items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async createThread(authorId: string, dto: CreateThreadDto) {
    const thread = this.threadRepo.create({ ...dto, authorId })
    const saved = await this.threadRepo.save(thread)
    return this.getThread(saved.id)
  }

  async pinThread(id: string, pinned: boolean) {
    const thread = await this.threadRepo.findOne({ where: { id } })
    if (!thread) throw new NotFoundException('Thread not found')
    thread.pinned = pinned
    return this.threadRepo.save(thread)
  }

  async deleteThread(id: string, userId: string, userRole: UserRole) {
    const thread = await this.threadRepo.findOne({ where: { id } })
    if (!thread) throw new NotFoundException('Thread not found')
    if (thread.authorId !== userId && userRole === 'user') {
      throw new ForbiddenException('Cannot delete this thread')
    }
    await this.threadRepo.remove(thread)
  }

  async createPost(threadId: string, authorId: string, dto: CreatePostDto) {
    const thread = await this.threadRepo.findOne({ where: { id: threadId } })
    if (!thread) throw new NotFoundException('Thread not found')

    let depth = 0
    let parentId: string | null = dto.parentId ?? null

    if (dto.parentId) {
      const parent = await this.postRepo.findOne({ where: { id: dto.parentId, threadId } })
      if (!parent) throw new NotFoundException('Parent post not found')
      depth = Math.min(parent.depth + 1, MAX_DEPTH)
    }

    const post = this.postRepo.create({ threadId, authorId, content: dto.content, parentId, depth })
    await this.postRepo.save(post)
    await this.threadRepo.update(threadId, { updatedAt: new Date() })

    const saved = await this.postRepo.findOne({
      where: { id: post.id },
      relations: { author: true },
      select: { author: AUTHOR_SELECT },
    })
    return saved!
  }

  async deletePost(id: string, userId: string, userRole: UserRole) {
    const post = await this.postRepo.findOne({ where: { id } })
    if (!post) throw new NotFoundException('Post not found')
    if (post.authorId !== userId && userRole === 'user') {
      throw new ForbiddenException('Cannot delete this post')
    }
    await this.postRepo.remove(post)
  }
}
