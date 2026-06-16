import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike } from 'typeorm'
import type { UserRole } from '@flashdev/gameweb-shared'
import { MarketListing } from './entities/market-listing.entity'
import { Inquiry } from './entities/inquiry.entity'
import { User } from '../users/entities/user.entity'
import { Project } from '../projects/entities/project.entity'
import { CreateListingDto } from './dto/create-listing.dto'
import { UpdateListingDto } from './dto/update-listing.dto'
import { ListingQueryDto } from './dto/listing-query.dto'
import { CreateInquiryDto } from './dto/create-inquiry.dto'
import { UpdateInquiryStatusDto } from './dto/update-inquiry-status.dto'

const SELLER_SELECT = { id: true, email: true, displayName: true, role: true }
const SENDER_SELECT = { id: true, email: true, displayName: true, role: true }
const PROJECT_SELECT = { id: true, title: true, type: true, status: true }

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(MarketListing)
    private readonly listingRepo: Repository<MarketListing>,
    @InjectRepository(Inquiry)
    private readonly inquiryRepo: Repository<Inquiry>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async findAll(query: ListingQueryDto) {
    const { type, status, search, page = 1, limit = 20 } = query

    const qb = this.listingRepo
      .createQueryBuilder('l')
      .leftJoin('l.seller', 's')
      .addSelect(['s.id', 's.email', 's.displayName', 's.role'])
      .leftJoin('l.project', 'p')
      .addSelect(['p.id', 'p.title', 'p.type', 'p.status'])
      .orderBy('l.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    if (type) qb.andWhere('l.type = :type', { type })
    if (status) qb.andWhere('l.status = :status', { status })
    if (search) {
      qb.andWhere(
        '(LOWER(l.title) LIKE :search OR LOWER(l.description) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      )
    }

    const [data, total] = await qb.getManyAndCount()
    await this.attachInquiryCounts(data)
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  private async attachInquiryCounts(listings: MarketListing[]) {
    if (!listings.length) return
    const ids = listings.map(l => l.id)
    const rows = (await this.inquiryRepo
      .createQueryBuilder('i')
      .select('i.listingId', 'listingId')
      .addSelect('COUNT(i.id)', 'count')
      .where('i.listingId IN (:...ids)', { ids })
      .groupBy('i.listingId')
      .getRawMany()) as { listingId: string; count: string }[]

    const countMap = new Map(rows.map(r => [r.listingId, Number(r.count)]))
    for (const listing of listings) {
      listing.inquiryCount = countMap.get(listing.id) ?? 0
    }
  }

  async findOne(id: string) {
    const listing = await this.listingRepo
      .createQueryBuilder('l')
      .leftJoin('l.seller', 's')
      .addSelect(['s.id', 's.email', 's.displayName', 's.role'])
      .leftJoin('l.project', 'p')
      .addSelect(['p.id', 'p.title', 'p.type', 'p.status'])
      .where('l.id = :id', { id })
      .getOne()

    if (!listing) throw new NotFoundException('Listing not found')
    listing.inquiryCount = await this.inquiryRepo.count({
      where: { listingId: id },
    })
    return listing
  }

  async create(sellerId: string, dto: CreateListingDto) {
    if (dto.projectId) {
      const project = await this.projectRepo.findOne({
        where: { id: dto.projectId },
      })
      if (!project) throw new NotFoundException('Project not found')
    }

    const listing = this.listingRepo.create({
      ...dto,
      sellerId,
      status: dto.status ?? 'draft',
    })
    return this.listingRepo.save(listing)
  }

  async update(
    id: string,
    dto: UpdateListingDto,
    userId: string,
    userRole: UserRole,
  ) {
    const listing = await this.listingRepo.findOne({ where: { id } })
    if (!listing) throw new NotFoundException('Listing not found')

    if (listing.sellerId !== userId && userRole === 'user') {
      throw new ForbiddenException('Cannot edit this listing')
    }

    if (dto.projectId && dto.projectId !== listing.projectId) {
      const project = await this.projectRepo.findOne({
        where: { id: dto.projectId },
      })
      if (!project) throw new NotFoundException('Project not found')
    }

    Object.assign(listing, dto)
    return this.listingRepo.save(listing)
  }

  async remove(id: string, userId: string, userRole: UserRole) {
    const listing = await this.listingRepo.findOne({ where: { id } })
    if (!listing) throw new NotFoundException('Listing not found')

    if (listing.sellerId !== userId && userRole === 'user') {
      throw new ForbiddenException('Cannot delete this listing')
    }

    await this.listingRepo.remove(listing)
  }

  async createInquiry(
    listingId: string,
    senderId: string,
    dto: CreateInquiryDto,
  ) {
    const listing = await this.listingRepo.findOne({ where: { id: listingId } })
    if (!listing) throw new NotFoundException('Listing not found')
    if (listing.status !== 'published') {
      throw new ForbiddenException('Cannot inquire on an unpublished listing')
    }

    const inquiry = this.inquiryRepo.create({
      listingId,
      senderId,
      message: dto.message,
    })
    return this.inquiryRepo.save(inquiry)
  }

  async findInquiriesByListing(
    listingId: string,
    userId: string,
    userRole: UserRole,
  ) {
    const listing = await this.listingRepo.findOne({ where: { id: listingId } })
    if (!listing) throw new NotFoundException('Listing not found')

    if (listing.sellerId !== userId && userRole === 'user') {
      throw new ForbiddenException('Cannot view inquiries for this listing')
    }

    return this.inquiryRepo.find({
      where: { listingId },
      relations: { sender: true },
      select: { sender: SENDER_SELECT },
      order: { createdAt: 'DESC' },
    })
  }

  async findMyInquiries(senderId: string) {
    return this.inquiryRepo.find({
      where: { senderId },
      relations: { listing: true, sender: true },
      select: { sender: SENDER_SELECT },
      order: { createdAt: 'DESC' },
    })
  }

  async updateInquiryStatus(
    id: string,
    dto: UpdateInquiryStatusDto,
    userId: string,
    userRole: UserRole,
  ) {
    const inquiry = await this.inquiryRepo.findOne({
      where: { id },
      relations: { listing: true },
    })
    if (!inquiry) throw new NotFoundException('Inquiry not found')

    const isSeller = inquiry.listing.sellerId === userId
    const isSender = inquiry.senderId === userId

    if (!isSeller && !isSender && userRole === 'user') {
      throw new ForbiddenException('Cannot update this inquiry')
    }

    inquiry.status = dto.status
    return this.inquiryRepo.save(inquiry)
  }
}
