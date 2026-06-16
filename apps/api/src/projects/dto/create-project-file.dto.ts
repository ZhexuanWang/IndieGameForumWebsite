import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator'

export class CreateProjectFileDto {
  @IsString()
  url: string

  @IsString()
  originalName: string

  @IsString()
  mimeType: string

  @IsNumber()
  @Min(0)
  size: number

  @IsOptional()
  @IsString()
  version?: string
}
