import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import { UsersService } from './users.service'
import type { User } from './entities/user.entity'

export interface SafeUser {
  id: string
  email: string
  displayName: string | null
  avatarUrl: string | null
  role: string
  emailVerified: boolean
  createdAt: Date
}

function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    role: user.role,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  }
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SafeUser> {
    const user = await this.usersService.findById(id)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return toSafeUser(user)
  }
}
