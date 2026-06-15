import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { ParseUUIDPipe } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ForumService } from './forum.service'
import { CreateThreadDto } from './dto/create-thread.dto'
import { CreatePostDto } from './dto/create-post.dto'
import type { User } from '../users/entities/user.entity'

@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Get('categories')
  getCategories() {
    return this.forumService.getCategories()
  }

  @Get('threads')
  getThreads(
    @Query('categoryId') categoryId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('authorId') authorId?: string,
  ) {
    return this.forumService.getThreads(
      categoryId,
      Number(page) || 1,
      Number(limit) || 20,
      search,
      authorId,
    )
  }

  @Get('threads/:id')
  getThread(@Param('id', ParseUUIDPipe) id: string) {
    return this.forumService.getThread(id)
  }

  @Get('threads/:id/posts')
  getThreadPosts(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.forumService.getThreadPosts(id, Number(page) || 1, Number(limit) || 10)
  }

  @Get('posts/:id/replies')
  getPostReplies(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.forumService.getPostReplies(id, Number(page) || 1, Number(limit) || 10)
  }

  @Post('threads')
  @UseGuards(JwtAuthGuard)
  createThread(@CurrentUser() user: User, @Body() dto: CreateThreadDto) {
    return this.forumService.createThread(user.id, dto)
  }

  @Patch('threads/:id/pin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'company')
  pinThread(@Param('id', ParseUUIDPipe) id: string, @Body('pinned') pinned: boolean) {
    return this.forumService.pinThread(id, pinned)
  }

  @Delete('threads/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteThread(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    await this.forumService.deleteThread(id, user.id, user.role)
  }

  @Post('threads/:id/posts')
  @UseGuards(JwtAuthGuard)
  createPost(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() dto: CreatePostDto,
  ) {
    return this.forumService.createPost(id, user.id, dto)
  }

  @Delete('posts/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    await this.forumService.deletePost(id, user.id, user.role)
  }
}
