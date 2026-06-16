import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike } from 'typeorm'
import type { SearchResults } from '@flashdev/gameweb-shared'
import { Project } from '../projects/entities/project.entity'
import { ForumThread } from '../forum/entities/forum-thread.entity'
import { MarketListing } from '../marketplace/entities/market-listing.entity'
import { User } from '../users/entities/user.entity'

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ForumThread)
    private readonly threadRepo: Repository<ForumThread>,
    @InjectRepository(MarketListing)
    private readonly listingRepo: Repository<MarketListing>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async search(query: string, limit = 10): Promise<SearchResults> {
    const term = query.trim()
    const like = ILike(`%${term}%`)

    const [projects, threads, listings, users] = await Promise.all([
      this.projectRepo
        .createQueryBuilder('p')
        .leftJoin('p.author', 'a')
        .addSelect(['a.id', 'a.displayName', 'a.email'])
        .where('p.title ILIKE :term OR p.description ILIKE :term', { term: `%${term}%` })
        .orderBy('p.createdAt', 'DESC')
        .limit(limit)
        .getMany(),

      this.threadRepo
        .createQueryBuilder('t')
        .leftJoin('t.author', 'a')
        .addSelect(['a.id', 'a.displayName', 'a.email'])
        .leftJoin('t.category', 'c')
        .addSelect(['c.id', 'c.name'])
        .where('t.title ILIKE :term OR t.body ILIKE :term', { term: `%${term}%` })
        .orderBy('t.createdAt', 'DESC')
        .limit(limit)
        .getMany(),

      this.listingRepo
        .createQueryBuilder('l')
        .leftJoin('l.seller', 's')
        .addSelect(['s.id', 's.displayName', 's.email'])
        .where('l.title ILIKE :term OR l.description ILIKE :term', { term: `%${term}%` })
        .orderBy('l.createdAt', 'DESC')
        .limit(limit)
        .getMany(),

      this.userRepo.find({
        where: [{ displayName: like }, { email: like }],
        order: { createdAt: 'DESC' },
        take: limit,
      }),
    ])

    return {
      query: term,
      projects: projects.map(p => ({
        id: p.id,
        title: p.title,
        type: p.type,
        status: p.status,
        authorId: p.authorId,
        authorName: p.author.displayName ?? p.author.email,
      })),
      threads: threads.map(t => ({
        id: t.id,
        title: t.title,
        categoryId: t.categoryId,
        categoryName: t.category?.name ?? null,
        authorId: t.authorId,
        authorName: t.author.displayName ?? t.author.email,
      })),
      listings: listings.map(l => ({
        id: l.id,
        title: l.title,
        type: l.type,
        status: l.status,
        sellerId: l.sellerId,
        sellerName: l.seller.displayName ?? l.seller.email,
      })),
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        role: u.role,
      })),
    }
  }
}
