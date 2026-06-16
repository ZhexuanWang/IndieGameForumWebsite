import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MarketplaceService } from './marketplace.service'
import { MarketListing } from './entities/market-listing.entity'
import { Inquiry } from './entities/inquiry.entity'
import { User } from '../users/entities/user.entity'
import { Project } from '../projects/entities/project.entity'
import { NotFoundException, ForbiddenException } from '@nestjs/common'

const mockListing: MarketListing = {
  id: 'list-1',
  type: 'sell',
  status: 'published',
  title: 'Source Code',
  description: 'Full source code for sale.',
  price: 100,
  sellerId: 'user-1',
  seller: {} as User,
  projectId: null,
  project: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockInquiry: Inquiry = {
  id: 'inq-1',
  listingId: 'list-1',
  listing: mockListing,
  senderId: 'user-2',
  sender: {} as User,
  message: 'Interested',
  status: 'pending',
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('MarketplaceService', () => {
  let service: MarketplaceService
  let listingRepo: Partial<Record<keyof Repository<MarketListing>, jest.Mock>>
  let inquiryRepo: Partial<Record<keyof Repository<Inquiry>, jest.Mock>>
  let projectRepo: Partial<Record<keyof Repository<Project>, jest.Mock>>

  beforeEach(async () => {
    listingRepo = {
      createQueryBuilder: jest.fn(() => ({
        leftJoin: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        loadRelationCountAndMap: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockListing], 1]),
        getOne: jest.fn().mockResolvedValue(mockListing),
      })),
      findOne: jest.fn().mockImplementation(() => Promise.resolve({ ...mockListing })),
      create: jest.fn().mockReturnValue(mockListing),
      save: jest.fn().mockImplementation(entity => Promise.resolve(entity)),
      remove: jest.fn().mockResolvedValue(undefined),
      count: jest.fn().mockResolvedValue(0),
    }
    inquiryRepo = {
      find: jest.fn().mockResolvedValue([mockInquiry]),
      findOne: jest.fn().mockResolvedValue(mockInquiry),
      create: jest.fn().mockReturnValue(mockInquiry),
      save: jest.fn().mockResolvedValue(mockInquiry),
      count: jest.fn().mockResolvedValue(0),
      createQueryBuilder: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      })),
    }
    projectRepo = {
      findOne: jest.fn().mockResolvedValue(null),
      find: jest.fn().mockResolvedValue([]),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketplaceService,
        { provide: getRepositoryToken(MarketListing), useValue: listingRepo },
        { provide: getRepositoryToken(Inquiry), useValue: inquiryRepo },
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: getRepositoryToken(Project), useValue: projectRepo },
      ],
    }).compile()

    service = module.get<MarketplaceService>(MarketplaceService)
  })

  it('should return paginated listings', async () => {
    const result = await service.findAll({ page: 1, limit: 10 })
    expect(result.data).toHaveLength(1)
    expect(result.total).toBe(1)
    expect(result.totalPages).toBe(1)
  })

  it('should find one listing', async () => {
    const result = await service.findOne('list-1')
    expect(result.id).toBe('list-1')
  })

  it('should create a listing', async () => {
    const result = await service.create('user-1', {
      title: 'New',
      description: 'Description here.',
      type: 'sell',
    })
    expect(result.id).toBe('list-1')
    expect(listingRepo.save).toHaveBeenCalled()
  })

  it('should forbid non-owner from updating', async () => {
    await expect(
      service.update('list-1', { title: 'Hacked' }, 'user-2', 'user'),
    ).rejects.toThrow(ForbiddenException)
  })

  it('should allow seller to update', async () => {
    const result = await service.update(
      'list-1',
      { status: 'closed' },
      'user-1',
      'user',
    )
    expect(result.status).toBe('closed')
  })

  it('should create an inquiry on published listing', async () => {
    const result = await service.createInquiry('list-1', 'user-2', {
      message: 'Interested',
    })
    expect(result.message).toBe('Interested')
  })

  it('should forbid inquiries on unpublished listings', async () => {
    listingRepo.findOne!.mockResolvedValueOnce({ ...mockListing, status: 'draft' })
    await expect(
      service.createInquiry('list-1', 'user-2', { message: 'Interested' }),
    ).rejects.toThrow(ForbiddenException)
  })

  it('should update inquiry status for seller', async () => {
    const result = await service.updateInquiryStatus(
      'inq-1',
      { status: 'replied' },
      'user-1',
      'user',
    )
    expect(result.status).toBe('replied')
  })
})
