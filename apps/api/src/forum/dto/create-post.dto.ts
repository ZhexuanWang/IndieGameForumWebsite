import { IsString, IsOptional, IsUUID, MinLength, MaxLength } from 'class-validator'

export class CreatePostDto {
  @IsString()
  @MinLength(2)
  @MaxLength(10000)
  content: string

  @IsOptional()
  @IsUUID()
  parentId?: string
}
