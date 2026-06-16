import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Project } from './entities/project.entity'
import { ProjectCategory } from './entities/project-category.entity'
import { ProjectFile } from './entities/project-file.entity'
import { ProjectsService } from './projects.service'
import { ProjectsController } from './projects.controller'
import { ProjectFilesService } from './project-files.service'
import { ProjectFilesController } from './project-files.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectCategory, ProjectFile])],
  providers: [ProjectsService, ProjectFilesService],
  controllers: [ProjectsController, ProjectFilesController],
  exports: [ProjectsService],
})
export class ProjectsModule {}
