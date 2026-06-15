import { Controller, Get, Post, Param, UseGuards, Query, ParseUUIDPipe } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { FollowsService } from './follows.service'
import type { User } from '../users/entities/user.entity'

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Get('status/:userId')
  async getStatus(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query('followerId') followerId?: string,
  ) {
    return this.followsService.isFollowing(followerId ?? null, userId)
  }

  @Get('followers/:userId')
  getFollowers(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.followsService.getFollowers(userId)
  }

  @Get('following/:userId')
  getFollowing(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.followsService.getFollowing(userId)
  }

  @Post(':userId')
  @UseGuards(JwtAuthGuard)
  toggle(
    @CurrentUser() user: User,
    @Param('userId', ParseUUIDPipe) followingId: string,
  ) {
    return this.followsService.toggle(user.id, followingId)
  }
}
