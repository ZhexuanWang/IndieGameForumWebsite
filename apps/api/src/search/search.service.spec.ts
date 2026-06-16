import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SearchService } from './search.service'
import { Project } from '../projects/entities/project.entity'
import { ForumThread } from '../forum/entities/forum-thread.entity'
import { MarketListing } from '../marketplace/entities/market-listing.entity'
import { User } from '../users/entities/user.entity'

describe('SearchService', () => {
  let service: SearchService
  let projectRepo: Partial<Record<keyof Repository<Project>, jest.Mock>>
  let threadRepo: Partial<Record<keyof Repository<ForumThread>, jest.Mock>>
  let listingRepo: Partial<Record<keyof Repository<MarketListing>, jest.Mock>>
  let userRepo: Partial<Record<keyof Repository<User>, jest.Mock>>

  beforeEach(async () => {
    const createQueryBuilder = (items: unknown[]) =>
      jest.fn(() => ({
        leftJoin: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(items),
      }))

    projectRepo = { createQueryBuilder: createQueryBuilder([]) }
    threadRepo = { createQueryBuilder: createQueryBuilder([]) }
    listingRepo = { createQueryBuilder: createQueryBuilder([]) }
    userRepo = { find: jest.fn().mockResolvedValue([]) }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        { provide: getRepositoryToken(Project), useValue: projectRepo },
        { provide: getRepositoryToken(ForumThread), useValue: threadRepo },
        { provide: getRepositoryToken(MarketListing), useValue: listingRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile()

    service = module.get<SearchService>(SearchService)
  })

  it('returns empty groups for empty query', async () => {
    const result = await service.search('', 10)
    expect(result.projects).toEqual([])
    expect(result.threads).toEqual([])
    expect(result.listings).toEqual([])
    expect(result.users).toEqual([])
  })

  it('returns mapped results for each group', async () => {
    const project = {
      id: 'p1',
      title: 'Neon Drifter',
      type: 'showcase',
      status: 'published',
      authorId: 'u1',
      author: { displayName: 'Dev', email: 'dev@e.com' },
    } as Project

    const thread = {
      id: 't1',
      title: 'Help wanted',
      categoryId: null,
      category: null,
      authorId: 'u1',
      author: { displayName: null, email: 'dev@e.com' },
    } as ForumThread

    const listing = {
      id: 'l1',
      title: 'Asset Pack',
      type: 'sell',
      status: 'published',
      sellerId: 'u2',
      seller: { displayName: 'Seller', email: 'seller@e.com' },
    } as MarketListing

    const user = {
      id: 'u1',
      email: 'dev@e.com',
      displayName: 'Dev',
      role: 'user',
    } as User

    projectRepo.createQueryBuilder = jest.fn(() => ({
      leftJoin: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([project]),
    }))

    threadRepo.createQueryBuilder = jest.fn(() => ({
      leftJoin: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([thread]),
    }))

    listingRepo.createQueryBuilder = jest.fn(() => ({
      leftJoin: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([listing]),
    }))

    userRepo.find = jest.fn().mockResolvedValue([user])

    const result = await service.search('neon', 5)
    expect(result.projects).toHaveLength(1)
    expect(result.projects[0].authorName).toBe('Dev')
    expect(result.threads).toHaveLength(1)
    expect(result.threads[0].authorName).toBe('dev@e.com')
    expect(result.listings).toHaveLength(1)
    expect(result.listings[0].sellerName).toBe('Seller')
    expect(result.users).toHaveLength(1)
    expect(result.users[0].role).toBe('user')
  })
})
