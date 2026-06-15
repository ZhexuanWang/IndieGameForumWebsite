import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { UnauthorizedException, ConflictException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'
import { User } from '../users/entities/user.entity'

const baseUser: User = {
  id: 'user-1',
  email: 'dev@flashdev.io',
  passwordHash: null,
  avatarUrl: null,
  displayName: 'dev_user',
  emailVerified: false,
  role: 'user',
  permissions: {},
  theme: 'cosmos',
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('AuthService', () => {
  let service: AuthService
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>
  let jwtService: Partial<JwtService>
  let hashedPassword: string

  beforeAll(async () => {
    hashedPassword = await bcrypt.hash('Password123!', 12)
  })

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    }

    jwtService = {
      sign: jest.fn().mockReturnValue('token'),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should register a new user and return tokens', async () => {
    usersService.findByEmail!.mockResolvedValue(null)
    usersService.create!.mockResolvedValue(baseUser)

    const result = await service.register({
      email: 'dev@flashdev.io',
      password: 'Password123!',
    })

    expect(result.user.email).toBe('dev@flashdev.io')
    expect(result.accessToken).toBe('token')
    expect(result.refreshToken).toBe('token')
    expect(usersService.create).toHaveBeenCalled()
  })

  it('should reject registration for duplicate email', async () => {
    usersService.findByEmail!.mockResolvedValue(baseUser)

    await expect(
      service.register({ email: 'dev@flashdev.io', password: 'Password123!' }),
    ).rejects.toThrow(ConflictException)
  })

  it('should login with valid credentials', async () => {
    usersService.findByEmail!.mockResolvedValue({
      ...baseUser,
      passwordHash: hashedPassword,
    })

    const result = await service.login({
      email: 'dev@flashdev.io',
      password: 'Password123!',
    })

    expect(result.user.email).toBe('dev@flashdev.io')
    expect(result.accessToken).toBe('token')
  })

  it('should reject login for unknown email', async () => {
    usersService.findByEmail!.mockResolvedValue(null)

    await expect(
      service.login({ email: 'missing@flashdev.io', password: 'Password123!' }),
    ).rejects.toThrow(UnauthorizedException)
  })

  it('should refresh tokens for a user', () => {
    const result = service.refreshTokens(baseUser)
    expect(result.user.id).toBe('user-1')
    expect(result.accessToken).toBe('token')
  })
})
