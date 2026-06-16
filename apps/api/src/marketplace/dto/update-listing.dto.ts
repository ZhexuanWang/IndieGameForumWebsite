import {
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsNumber,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator'
import type { MarketListingType, MarketListingStatus } from '@flashdev/gameweb-shared'

export class UpdateListingDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title?: string

  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string

  @IsOptional()
  @IsEnum(['sell', 'buy', 'promo', 'host'] as MarketListingType[])
  type?: MarketListingType

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number

  @IsOptional()
  @IsUUID()
  projectId?: string

  @IsOptional()
  @IsEnum(['draft', 'published', 'closed'] as MarketListingStatus[])
  status?: MarketListingStatus
}
