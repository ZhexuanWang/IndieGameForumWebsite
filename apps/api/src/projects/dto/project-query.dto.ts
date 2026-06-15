import { IsOptional, IsEnum, IsString, IsInt, Min, Max, IsUUID } from 'class-validator'
import { Type } from 'class-transformer'
import type { ProjectType, ProjectStatus } from '@flashdev/gameweb-shared'

export class ProjectQueryDto {
  @IsOptional()
  @IsEnum(['showcase', 'sale', 'custom'])
  type?: ProjectType

  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: ProjectStatus

  @IsOptional()
  @IsUUID()
  categoryId?: string

  @IsOptional()
  @IsUUID()
  authorId?: string

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20
}
