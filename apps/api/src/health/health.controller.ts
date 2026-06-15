import { Controller, Get } from '@nestjs/common'
import { ApiResponse } from '@flashdev/gameweb-shared'

@Controller('health')
export class HealthController {
  @Get()
  health(): ApiResponse<{ status: string; uptime: number }> {
    return {
      data: {
        status: 'ok',
        uptime: process.uptime(),
      },
      message: 'FlashDev GameWeb API is running',
    }
  }
}
