import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProjectFilesService } from './project-files.service'
import { ProjectFile } from './entities/project-file.entity'
import { Project } from './entities/project.entity'
import { NotFoundException, ForbiddenException } from '@nestjs/common'

const mockProject: Project = {
  id: 'proj-1',
  title: 'Neon Drifter',
  description: 'A cyberpunk racer.',
  type: 'showcase',
  status: 'published',
  price: null,
  tags: [],
  thumbnailUrl: null,
  demoUrl: null,
  authorId: 'user-1',
  categoryId: null,
  author: {} as any,
  category: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockFile: ProjectFile = {
  id: 'file-1',
  projectId: 'proj-1',
  project: mockProject,
  originalName: 'build.zip',
  filename: 'build.zip',
  mimeType: 'application/zip',
  size: 1024,
  fileUrl: '/uploads/build.zip',
  version: 'v1.0.0',
  createdAt: new Date(),
}

describe('ProjectFilesService', () => {
  let service: ProjectFilesService
  let fileRepo: Partial<Record<keyof Repository<ProjectFile>, jest.Mock>>
  let projectRepo: Partial<Record<keyof Repository<Project>, jest.Mock>>

  beforeEach(async () => {
    fileRepo = {
      find: jest.fn().mockResolvedValue([mockFile]),
      findOne: jest.fn().mockResolvedValue(mockFile),
      create: jest.fn().mockReturnValue(mockFile),
      save: jest.fn().mockResolvedValue(mockFile),
      remove: jest.fn().mockResolvedValue(undefined),
    }
    projectRepo = {
      findOne: jest.fn().mockResolvedValue(mockProject),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectFilesService,
        { provide: getRepositoryToken(ProjectFile), useValue: fileRepo },
        { provide: getRepositoryToken(Project), useValue: projectRepo },
      ],
    }).compile()

    service = module.get<ProjectFilesService>(ProjectFilesService)
  })

  it('should return files by project', async () => {
    const result = await service.findByProject('proj-1')
    expect(result).toHaveLength(1)
    expect(result[0].originalName).toBe('build.zip')
  })

  it('should create a file record for project owner', async () => {
    const result = await service.create(
      'proj-1',
      {
        url: '/uploads/build.zip',
        originalName: 'build.zip',
        mimeType: 'application/zip',
        size: 1024,
        version: 'v1.0.0',
      },
      'user-1',
      'user',
    )
    expect(result.originalName).toBe('build.zip')
    expect(fileRepo.save).toHaveBeenCalled()
  })

  it('should forbid non-owner from creating file', async () => {
    await expect(
      service.create(
        'proj-1',
        {
          url: '/uploads/build.zip',
          originalName: 'build.zip',
          mimeType: 'application/zip',
          size: 1024,
        },
        'user-2',
        'user',
      ),
    ).rejects.toThrow(ForbiddenException)
  })

  it('should remove a file for project owner', async () => {
    await service.remove('proj-1', 'file-1', 'user-1', 'user')
    expect(fileRepo.remove).toHaveBeenCalled()
  })

  it('should throw when removing non-existent file', async () => {
    fileRepo.findOne!.mockResolvedValueOnce(null)
    await expect(
      service.remove('proj-1', 'missing', 'user-1', 'user'),
    ).rejects.toThrow(NotFoundException)
  })
})
