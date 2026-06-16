import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike, type FindOptionsWhere } from 'typeorm'
import { promises as fs } from 'fs'
import { join } from 'path'
import { Project } from './entities/project.entity'
import { ProjectCategory } from './entities/project-category.entity'
import { ProjectFile } from './entities/project-file.entity'
import { UPLOAD_DIR } from '../uploads/upload.config'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { ProjectQueryDto } from './dto/project-query.dto'
import type { UserRole } from '@flashdev/gameweb-shared'

const AUTHOR_SELECT = { id: true, email: true, displayName: true, role: true }

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectCategory) private readonly categoryRepo: Repository<ProjectCategory>,
    @InjectRepository(ProjectFile) private readonly fileRepo: Repository<ProjectFile>,
  ) {}

  async findAll(query: ProjectQueryDto) {
    const { type, status, categoryId, authorId, search, page = 1, limit = 20 } = query

    const where: FindOptionsWhere<Project> = {}
    if (type) where.type = type
    if (status) where.status = status
    if (categoryId) where.categoryId = categoryId
    if (authorId) where.authorId = authorId

    const baseWhere = search
      ? [
          { ...where, title: ILike(`%${search}%`) },
          { ...where, description: ILike(`%${search}%`) },
        ]
      : where

    const [items, total] = await this.projectRepo.findAndCount({
      where: baseWhere,
      relations: { author: true, category: true },
      select: { author: AUTHOR_SELECT },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })

    return { data: items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: string) {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: { author: true, category: true, files: true },
      select: { author: AUTHOR_SELECT },
    })
    if (!project) throw new NotFoundException('Project not found')
    return project
  }

  async create(authorId: string, dto: CreateProjectDto) {
    const project = this.projectRepo.create({
      ...dto,
      authorId,
      tags: dto.tags ?? [],
    })
    return this.projectRepo.save(project)
  }

  async update(id: string, dto: UpdateProjectDto, userId: string, userRole: UserRole) {
    const project = await this.findOne(id)
    if (project.authorId !== userId && userRole === 'user') {
      throw new ForbiddenException("Cannot edit another user's project")
    }
    Object.assign(project, dto)
    return this.projectRepo.save(project)
  }

  async remove(id: string, userId: string, userRole: UserRole) {
    const project = await this.findOne(id)
    if (project.authorId !== userId && userRole === 'user') {
      throw new ForbiddenException("Cannot delete another user's project")
    }

    const files = await this.fileRepo.find({ where: { projectId: id } })
    for (const file of files) {
      await fs.unlink(join(UPLOAD_DIR, file.filename)).catch(() => {})
    }

    await this.projectRepo.remove(project)
  }

  findAllCategories() {
    return this.categoryRepo.find({ order: { displayOrder: 'ASC', name: 'ASC' } })
  }
}
