import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { UsersService } from '../users/users.service'
import { User } from '../users/entities/user.entity'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import type { UserRole } from '@flashdev/gameweb-shared'

export type SafeUser = Omit<User, 'passwordHash'>

interface TokenPair {
  accessToken: string
  refreshToken: string
}

function sanitize(user: User): SafeUser {
  const { passwordHash: _ph, ...safe } = user
  return safe as SafeUser
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private signAccess(userId: string, role: UserRole): string {
    return this.jwtService.sign(
      { sub: userId, role },
      {
        secret: process.env.JWT_SECRET || 'dev_jwt_secret_change_in_prod',
        expiresIn: 15 * 60,
      },
    )
  }

  private signRefresh(userId: string): string {
    return this.jwtService.sign(
      { sub: userId },
      {
        secret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_in_prod',
        expiresIn: 7 * 24 * 60 * 60,
      },
    )
  }

  buildTokens(user: User): TokenPair {
    return {
      accessToken: this.signAccess(user.id, user.role),
      refreshToken: this.signRefresh(user.id),
    }
  }

  private genDisplayName(): string {
    return `user_${crypto.randomBytes(4).toString('hex')}`
  }

  async register(dto: RegisterDto): Promise<{ user: SafeUser } & TokenPair> {
    const existing = await this.usersService.findByEmail(dto.email)
    if (existing) throw new ConflictException('Email already in use')

    const passwordHash = await bcrypt.hash(dto.password, 12)
    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
      displayName: this.genDisplayName(),
    })

    return { user: sanitize(user), ...this.buildTokens(user) }
  }

  async login(dto: LoginDto): Promise<{ user: SafeUser } & TokenPair> {
    const user = await this.usersService.findByEmail(dto.email)
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials')

    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    return { user: sanitize(user), ...this.buildTokens(user) }
  }

  refreshTokens(user: User): { user: SafeUser } & TokenPair {
    return { user: sanitize(user), ...this.buildTokens(user) }
  }

  me(user: User): SafeUser {
    return sanitize(user)
  }
}
