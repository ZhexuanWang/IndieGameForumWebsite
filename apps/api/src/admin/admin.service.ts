import { Injectable } from '@nestjs/common'
import type { UserRole } from '@flashdev/gameweb-shared'
import { UsersService } from '../users/users.service'

@Injectable()
export class AdminService {
  constructor(private readonly usersService: UsersService) {}

  findUsers(query: { page?: number; limit?: number; search?: string }) {
    return this.usersService.findAll(query)
  }

  async updateRole(id: string, role: UserRole) {
    await this.usersService.updateRole(id, role)
  }
}
