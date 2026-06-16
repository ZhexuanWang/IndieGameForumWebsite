import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'
import type { MarketListingType, MarketListingStatus } from '@flashdev/gameweb-shared'

export class ListingQueryDto {
  @IsOptional()
  @IsEnum(['sell', 'buy', 'promo', 'host'] as MarketListingType[])
  type?: MarketListingType

  @IsOptional()
  @IsEnum(['draft', 'published', 'closed'] as MarketListingStatus[])
  status?: MarketListingStatus

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
  limit?: number = 20
}
