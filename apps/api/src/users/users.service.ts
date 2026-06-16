import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike } from 'typeorm'
import { User } from './entities/user.entity'
import type { UserRole, UserPermissions } from '@flashdev/gameweb-shared'

export interface CreateUserData {
  email: string
  passwordHash?: string | null
  avatarUrl?: string | null
  displayName?: string | null
  emailVerified?: boolean
  role?: UserRole
  permissions?: UserPermissions
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  findById(id: string): Promise<User | null> {
    return this.repo.findOneBy({ id })
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOneBy({ email })
  }

  async findByIdOrFail(id: string): Promise<User> {
    const user = await this.findById(id)
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  create(data: CreateUserData): Promise<User> {
    const user = this.repo.create({
      email: data.email,
      passwordHash: data.passwordHash ?? null,
      avatarUrl: data.avatarUrl ?? null,
      displayName: data.displayName ?? null,
      emailVerified: data.emailVerified ?? false,
      role: data.role ?? 'user',
      permissions: data.permissions ?? {},
    })
    return this.repo.save(user)
  }

  async update(id: string, data: Partial<Pick<User, 'avatarUrl' | 'displayName' | 'emailVerified'>>): Promise<void> {
    await this.repo.update(id, data)
  }

  async findAll(query: { page?: number; limit?: number; search?: string }) {
    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const where = query.search
      ? [
          { displayName: ILike(`%${query.search}%`) },
          { email: ILike(`%${query.search}%`) },
        ]
      : undefined

    const [data, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async updateRole(id: string, role: UserRole): Promise<void> {
    const result = await this.repo.update(id, { role })
    if (result.affected === 0) throw new NotFoundException('User not found')
  }
}
