import { IsString, IsOptional, IsUUID, MinLength, MaxLength } from 'class-validator'

export class CreateThreadDto {
  @IsString()
  @MinLength(5)
  @MaxLength(300)
  title: string

  @IsString()
  @MinLength(10)
  @MaxLength(10000)
  body: string

  @IsOptional()
  @IsUUID()
  categoryId?: string
}
