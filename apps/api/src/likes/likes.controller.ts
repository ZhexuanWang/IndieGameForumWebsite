import { Controller, Get, Post, Param, UseGuards, Query } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { LikesService } from './likes.service'
import type { LikeTargetType } from './entities/like.entity'
import type { User } from '../users/entities/user.entity'

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getLikedItems(@CurrentUser() user: User) {
    return this.likesService.getLikedItems(user.id)
  }

  @Get(':targetType/:targetId/status')
  getStatus(
    @Param('targetType') targetType: LikeTargetType,
    @Param('targetId') targetId: string,
    @Query('userId') userId?: string,
  ) {
    return this.likesService.getStatus(userId ?? null, targetType, targetId)
  }

  @UseGuards(JwtAuthGuard)
  @Post(':targetType/:targetId')
  toggle(
    @CurrentUser() user: User,
    @Param('targetType') targetType: LikeTargetType,
    @Param('targetId') targetId: string,
  ) {
    return this.likesService.toggle(user.id, targetType, targetId)
  }
}
