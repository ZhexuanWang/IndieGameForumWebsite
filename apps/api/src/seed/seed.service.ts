import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { ProjectCategory } from '../projects/entities/project-category.entity'

const SEED_CATEGORIES = [
  { name: 'Action', slug: 'action', displayOrder: 1 },
  { name: 'Adventure', slug: 'adventure', displayOrder: 2 },
  { name: 'RPG', slug: 'rpg', displayOrder: 3 },
  { name: 'Strategy', slug: 'strategy', displayOrder: 4 },
  { name: 'Puzzle', slug: 'puzzle', displayOrder: 5 },
  { name: 'Simulation', slug: 'simulation', displayOrder: 6 },
  { name: 'Tools & Engine', slug: 'tools', displayOrder: 7 },
]

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name)

  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(ProjectCategory)
    private readonly categoryRepo: Repository<ProjectCategory>,
  ) {}

  async onModuleInit() {
    await this.seedAdminAccount()
    await this.seedCategories()
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

  private async seedCategories() {
    for (const cat of SEED_CATEGORIES) {
      const exists = await this.categoryRepo.findOne({ where: { slug: cat.slug } })
      if (!exists) {
        await this.categoryRepo.save(this.categoryRepo.create(cat))
        this.logger.log(`Category seeded -> ${cat.name}`)
      }
    }
  }
}
