import { Test, TestingModule } from '@nestjs/testing'
import { AdminService } from './admin.service'
import { UsersService } from '../users/users.service'

describe('AdminService', () => {
  let service: AdminService
  let usersService: Partial<UsersService>

  beforeEach(async () => {
    usersService = {
      findAll: jest.fn().mockResolvedValue({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 }),
      updateRole: jest.fn().mockResolvedValue(undefined),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: UsersService, useValue: usersService },
      ],
    }).compile()

    service = module.get<AdminService>(AdminService)
  })

  it('should delegate user list to UsersService', async () => {
    const result = await service.findUsers({ page: 1, limit: 10, search: 'test' })
    expect(usersService.findAll).toHaveBeenCalledWith({ page: 1, limit: 10, search: 'test' })
    expect(result.total).toBe(0)
  })

  it('should delegate role update to UsersService', async () => {
    await service.updateRole('user-1', 'admin')
    expect(usersService.updateRole).toHaveBeenCalledWith('user-1', 'admin')
  })
})
