import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators/roles.decorator'
import type { UserRole } from '@flashdev/gameweb-shared'
import { User } from '../../users/entities/user.entity'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!required?.length) return true

    const req = context.switchToHttp().getRequest<{ user?: User }>()
    const user = req.user
    if (!user) return false

    const hierarchy: UserRole[] = ['user', 'admin', 'company']
    const userLevel = hierarchy.indexOf(user.role)

    return required.some(r => hierarchy.indexOf(r) <= userLevel)
  }
}
