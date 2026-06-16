import { IsEnum } from 'class-validator'
import type { UserRole } from '@flashdev/gameweb-shared'

export class UpdateRoleDto {
  @IsEnum(['user', 'admin', 'company'])
  role: UserRole
}
