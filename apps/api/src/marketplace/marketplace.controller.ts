import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ParseUUIDPipe } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { MarketplaceService } from './marketplace.service'
import { CreateListingDto } from './dto/create-listing.dto'
import { UpdateListingDto } from './dto/update-listing.dto'
import { ListingQueryDto } from './dto/listing-query.dto'
import { CreateInquiryDto } from './dto/create-inquiry.dto'
import { UpdateInquiryStatusDto } from './dto/update-inquiry-status.dto'
import type { User } from '../users/entities/user.entity'

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('listings')
  findAll(@Query() query: ListingQueryDto) {
    return this.marketplaceService.findAll(query)
  }

  @Get('listings/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.marketplaceService.findOne(id)
  }

  @Post('listings')
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: User, @Body() dto: CreateListingDto) {
    return this.marketplaceService.create(user.id, dto)
  }

  @Patch('listings/:id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateListingDto,
    @CurrentUser() user: User,
  ) {
    return this.marketplaceService.update(id, dto, user.id, user.role)
  }

  @Delete('listings/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    await this.marketplaceService.remove(id, user.id, user.role)
  }

  @Post('listings/:id/inquiries')
  @UseGuards(JwtAuthGuard)
  createInquiry(
    @Param('id', ParseUUIDPipe) listingId: string,
    @CurrentUser() user: User,
    @Body() dto: CreateInquiryDto,
  ) {
    return this.marketplaceService.createInquiry(listingId, user.id, dto)
  }

  @Get('listings/:id/inquiries')
  @UseGuards(JwtAuthGuard)
  findInquiriesByListing(
    @Param('id', ParseUUIDPipe) listingId: string,
    @CurrentUser() user: User,
  ) {
    return this.marketplaceService.findInquiriesByListing(
      listingId,
      user.id,
      user.role,
    )
  }

  @Get('inquiries/me')
  @UseGuards(JwtAuthGuard)
  findMyInquiries(@CurrentUser() user: User) {
    return this.marketplaceService.findMyInquiries(user.id)
  }

  @Patch('inquiries/:id/status')
  @UseGuards(JwtAuthGuard)
  updateInquiryStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateInquiryStatusDto,
    @CurrentUser() user: User,
  ) {
    return this.marketplaceService.updateInquiryStatus(
      id,
      dto,
      user.id,
      user.role,
    )
  }
}
