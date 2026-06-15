import {
  IsString, IsEnum, IsOptional, IsNumber, IsUUID,
  IsArray, MinLength, MaxLength, Min,
} from 'class-validator'
import { Type } from 'class-transformer'
import type { ProjectType } from '@flashdev/gameweb-shared'

export class CreateProjectDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string

  @IsString()
  @MinLength(10)
  description: string

  @IsEnum(['showcase', 'sale', 'custom'])
  type: ProjectType

  @IsOptional()
  @IsUUID()
  categoryId?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @IsOptional()
  @IsString()
  thumbnailUrl?: string

  @IsOptional()
  @IsString()
  demoUrl?: string
}
