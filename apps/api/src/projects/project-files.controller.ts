import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ProjectFilesService } from './project-files.service'
import { CreateProjectFileDto } from './dto/create-project-file.dto'
import type { User } from '../users/entities/user.entity'

@Controller('projects/:projectId/files')
export class ProjectFilesController {
  constructor(private readonly filesService: ProjectFilesService) {}

  @Get()
  findAll(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.filesService.findByProject(projectId)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @CurrentUser() user: User,
    @Body() dto: CreateProjectFileDto,
  ) {
    return this.filesService.create(projectId, dto, user.id, user.role)
  }

  @Delete(':fileId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('fileId', ParseUUIDPipe) fileId: string,
    @CurrentUser() user: User,
  ) {
    await this.filesService.remove(projectId, fileId, user.id, user.role)
  }
}
