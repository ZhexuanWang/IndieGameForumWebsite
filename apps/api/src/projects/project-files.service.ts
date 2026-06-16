import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { promises as fs } from 'fs'
import { basename, join } from 'path'
import type { UserRole } from '@flashdev/gameweb-shared'
import { ProjectFile } from './entities/project-file.entity'
import { Project } from './entities/project.entity'
import { UPLOAD_DIR } from '../uploads/upload.config'
import { CreateProjectFileDto } from './dto/create-project-file.dto'

@Injectable()
export class ProjectFilesService {
  constructor(
    @InjectRepository(ProjectFile)
    private readonly fileRepo: Repository<ProjectFile>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async findByProject(projectId: string) {
    return this.fileRepo.find({
      where: { projectId },
      order: { createdAt: 'DESC' },
    })
  }

  async create(
    projectId: string,
    dto: CreateProjectFileDto,
    userId: string,
    userRole: UserRole,
  ) {
    const project = await this.projectRepo.findOne({ where: { id: projectId } })
    if (!project) throw new NotFoundException('Project not found')
    if (project.authorId !== userId && userRole === 'user') {
      throw new ForbiddenException('Cannot add files to this project')
    }

    const filename = basename(dto.url)
    const file = this.fileRepo.create({
      projectId,
      originalName: dto.originalName,
      filename,
      mimeType: dto.mimeType,
      size: dto.size,
      fileUrl: dto.url,
      version: dto.version ?? null,
    })
    return this.fileRepo.save(file)
  }

  async remove(
    projectId: string,
    fileId: string,
    userId: string,
    userRole: UserRole,
  ) {
    const project = await this.projectRepo.findOne({ where: { id: projectId } })
    if (!project) throw new NotFoundException('Project not found')
    if (project.authorId !== userId && userRole === 'user') {
      throw new ForbiddenException('Cannot remove files from this project')
    }

    const file = await this.fileRepo.findOne({
      where: { id: fileId, projectId },
    })
    if (!file) throw new NotFoundException('File not found')

    await fs.unlink(join(UPLOAD_DIR, file.filename)).catch(() => {})
    await this.fileRepo.remove(file)
  }

  async removeAllForProject(projectId: string) {
    const files = await this.fileRepo.find({ where: { projectId } })
    for (const file of files) {
      await fs.unlink(join(UPLOAD_DIR, file.filename)).catch(() => {})
    }
    if (files.length) {
      await this.fileRepo.remove(files)
    }
  }
}
