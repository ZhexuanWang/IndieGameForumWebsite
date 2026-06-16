import { Controller, Get, Query } from '@nestjs/common'
import { SearchService } from './search.service'

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(
    @Query('q') query: string,
    @Query('limit') limit?: string,
  ) {
    const q = query?.trim() ?? ''
    if (!q) {
      return this.searchService.search('', 0)
    }
    return this.searchService.search(q, limit ? parseInt(limit, 10) : 10)
  }
}
