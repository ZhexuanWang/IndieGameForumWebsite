import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { ProjectCategory } from '../projects/entities/project-category.entity'
import { Project } from '../projects/entities/project.entity'
import { ForumCategory } from '../forum/entities/forum-category.entity'
import { ForumThread } from '../forum/entities/forum-thread.entity'
import { ForumPost } from '../forum/entities/forum-post.entity'
import { MarketListing } from '../marketplace/entities/market-listing.entity'
import { Inquiry } from '../marketplace/entities/inquiry.entity'

const SEED_PROJECT_CATEGORIES = [
  { name: 'Action', slug: 'action', displayOrder: 1 },
  { name: 'Adventure', slug: 'adventure', displayOrder: 2 },
  { name: 'RPG', slug: 'rpg', displayOrder: 3 },
  { name: 'Strategy', slug: 'strategy', displayOrder: 4 },
  { name: 'Puzzle', slug: 'puzzle', displayOrder: 5 },
  { name: 'Simulation', slug: 'simulation', displayOrder: 6 },
  { name: 'Tools & Engine', slug: 'tools', displayOrder: 7 },
]

const SEED_FORUM_CATEGORIES = [
  { name: 'General', slug: 'general', description: 'General indie game discussion', displayOrder: 1 },
  { name: 'Showcase', slug: 'showcase', description: 'Share your projects', displayOrder: 2 },
  { name: 'Help & Questions', slug: 'help', description: 'Ask the community', displayOrder: 3 },
  { name: 'Market Talk', slug: 'market', description: 'Buying, selling, pricing', displayOrder: 4 },
  { name: 'Collaboration', slug: 'collab', description: 'Find teammates and partners', displayOrder: 5 },
]

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name)

  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(ProjectCategory)
    private readonly categoryRepo: Repository<ProjectCategory>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ForumCategory)
    private readonly forumCatRepo: Repository<ForumCategory>,
    @InjectRepository(ForumThread)
    private readonly threadRepo: Repository<ForumThread>,
    @InjectRepository(ForumPost)
    private readonly postRepo: Repository<ForumPost>,
    @InjectRepository(MarketListing)
    private readonly listingRepo: Repository<MarketListing>,
    @InjectRepository(Inquiry)
    private readonly inquiryRepo: Repository<Inquiry>,
  ) {}

  async onModuleInit() {
    await this.seedAdminAccount()
    await this.seedProjectCategories()
    await this.seedForumCategories()
    await this.seedDemoProjects()
    await this.seedDemoThreads()
    await this.seedMarketplaceListings()
  }

  private async seedAdminAccount() {
    const email = process.env.ADMIN_EMAIL || 'admin@flashdev.io'
    const password = process.env.ADMIN_PASSWORD || 'FlashDev2026!'

    const existing = await this.usersService.findByEmail(email)
    if (existing) return

    const passwordHash = await bcrypt.hash(password, 12)
    await this.usersService.create({ email, passwordHash, role: 'admin' })
    this.logger.log(`Admin account seeded -> ${email}`)
  }

  private async seedProjectCategories() {
    for (const cat of SEED_PROJECT_CATEGORIES) {
      const exists = await this.categoryRepo.findOne({ where: { slug: cat.slug } })
      if (!exists) {
        await this.categoryRepo.save(this.categoryRepo.create(cat))
        this.logger.log(`Project category seeded -> ${cat.name}`)
      }
    }
  }

  private async seedForumCategories() {
    for (const cat of SEED_FORUM_CATEGORIES) {
      const exists = await this.forumCatRepo.findOne({ where: { slug: cat.slug } })
      if (!exists) {
        await this.forumCatRepo.save(this.forumCatRepo.create(cat))
        this.logger.log(`Forum category seeded -> ${cat.name}`)
      }
    }
  }

  private async seedDemoProjects() {
    const count = await this.projectRepo.count()
    if (count > 0) return

    const admin = await this.usersService.findByEmail(process.env.ADMIN_EMAIL || 'admin@flashdev.io')
    if (!admin) return

    const categories = await this.categoryRepo.find()
    const demos = [
      {
        title: 'Neon Drifter',
        description: 'A cyberpunk top-down racer built with Godot. Features procedural tracks and synthwave soundtrack.',
        type: 'showcase' as const,
        status: 'published' as const,
        tags: ['racing', 'godot', 'cyberpunk'],
        demoUrl: 'https://example.com/neon-drifter',
      },
      {
        title: 'Pixel Dungeon Toolkit',
        description: 'A complete roguelike starter kit with turn-based combat, inventory, and procedural dungeons.',
        type: 'sale' as const,
        status: 'published' as const,
        price: 29.99,
        tags: ['unity', 'roguelike', 'assets'],
        thumbnailUrl: 'https://example.com/pixel-dungeon-thumb.jpg',
      },
      {
        title: 'Echoes of the Void',
        description: 'Narrative-driven space exploration prototype seeking collaborators for art and sound design.',
        type: 'custom' as const,
        status: 'draft' as const,
        tags: ['narrative', 'space', 'prototype'],
      },
    ]

    for (let i = 0; i < demos.length; i++) {
      const project = this.projectRepo.create({
        ...demos[i],
        authorId: admin.id,
        categoryId: categories[i % categories.length]?.id ?? null,
      })
      await this.projectRepo.save(project)
      this.logger.log(`Demo project seeded -> ${project.title}`)
    }
  }

  private async seedDemoThreads() {
    const count = await this.threadRepo.count()
    if (count > 0) return

    const admin = await this.usersService.findByEmail(process.env.ADMIN_EMAIL || 'admin@flashdev.io')
    if (!admin) return

    const showcase = await this.forumCatRepo.findOne({ where: { slug: 'showcase' } })
    if (!showcase) return

    const thread = this.threadRepo.create({
      title: 'Welcome to FlashDev Indie Game Forum',
      body: 'This is a place to share your indie games, ask questions, and find collaborators. Feel free to introduce yourself!',
      authorId: admin.id,
      categoryId: showcase.id,
      pinned: true,
    })
    const saved = await this.threadRepo.save(thread)

    const post = this.postRepo.create({
      threadId: saved.id,
      authorId: admin.id,
      content: 'Rules: be respectful, give constructive feedback, and have fun building games.',
      depth: 0,
    })
    await this.postRepo.save(post)
    this.logger.log('Demo forum thread seeded')
  }

  private async seedMarketplaceListings() {
    const count = await this.listingRepo.count()
    if (count > 0) return

    const admin = await this.usersService.findByEmail(
      process.env.ADMIN_EMAIL || 'admin@flashdev.io',
    )
    if (!admin) return

    const projects = await this.projectRepo.find({ take: 2 })

    const listings = [
      {
        title: 'Neon Drifter — Full Source Code',
        description:
          'Sell the complete Godot source code, assets, and publishing rights for Neon Drifter.',
        type: 'sell' as const,
        status: 'published' as const,
        price: 499,
      },
      {
        title: 'Indie Game Hosting Bundle',
        description:
          'Affordable hosting for demo builds and multiplayer lobby servers.',
        type: 'host' as const,
        status: 'published' as const,
        price: 19.99,
      },
      {
        title: 'Pixel Art Collaboration Wanted',
        description:
          'Looking for a pixel artist to join a roguelike project. Revenue share.',
        type: 'promo' as const,
        status: 'published' as const,
      },
    ]

    for (let i = 0; i < listings.length; i++) {
      const listing = this.listingRepo.create({
        ...listings[i],
        sellerId: admin.id,
        projectId: projects[i % projects.length]?.id ?? null,
      })
      await this.listingRepo.save(listing)
      this.logger.log(`Demo marketplace listing seeded -> ${listing.title}`)
    }
  }
}
