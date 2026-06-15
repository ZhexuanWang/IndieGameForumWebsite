import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProjectsService } from './projects.service'
import { Project } from './entities/project.entity'
import { ProjectCategory } from './entities/project-category.entity'
import { User } from '../users/entities/user.entity'
import { NotFoundException, ForbiddenException } from '@nestjs/common'

const mockProject: Project = {
  id: 'proj-1',
  title: 'Neon Drifter',
  description: 'A cyberpunk racer.',
  type: 'showcase',
  status: 'published',
  price: null,
  tags: ['racing'],
  thumbnailUrl: null,
  demoUrl: null,
  authorId: 'user-1',
  categoryId: null,
  author: {} as User,
  category: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('ProjectsService', () => {
  let service: ProjectsService
  let projectRepo: Partial<Record<keyof Repository<Project>, jest.Mock>>
  let categoryRepo: Partial<Record<keyof Repository<ProjectCategory>, jest.Mock>>

  beforeEach(async () => {
    projectRepo = {
      findAndCount: jest.fn().mockResolvedValue([[mockProject], 1]),
      findOne: jest.fn().mockResolvedValue(mockProject),
      create: jest.fn().mockReturnValue(mockProject),
      save: jest.fn().mockResolvedValue(mockProject),
      remove: jest.fn().mockResolvedValue(undefined),
    }
    categoryRepo = {
      find: jest.fn().mockResolvedValue([]),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: getRepositoryToken(Project), useValue: projectRepo },
        { provide: getRepositoryToken(ProjectCategory), useValue: categoryRepo },
      ],
    }).compile()

    service = module.get<ProjectsService>(ProjectsService)
  })

  it('should return paginated projects', async () => {
    const result = await service.findAll({ page: 1, limit: 10 })
    expect(result.items).toHaveLength(1)
    expect(result.total).toBe(1)
  })

  it('should find one project', async () => {
    const result = await service.findOne('proj-1')
    expect(result.id).toBe('proj-1')
  })

  it('should throw NotFoundException when project not found', async () => {
    projectRepo.findOne!.mockResolvedValue(null)
    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException)
  })

  it('should create a project', async () => {
    const result = await service.create('user-1', {
      title: 'New Game',
      description: 'A great new game.',
      type: 'showcase',
    })
    expect(result.id).toBe('proj-1')
    expect(projectRepo.save).toHaveBeenCalled()
  })

  it('should forbid non-owner user from updating', async () => {
    await expect(
      service.update('proj-1', { title: 'Hacked' }, 'user-2', 'user'),
    ).rejects.toThrow(ForbiddenException)
  })
})
