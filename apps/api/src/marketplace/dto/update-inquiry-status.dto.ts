import { IsEnum } from 'class-validator'
import type { InquiryStatus } from '@flashdev/gameweb-shared'

export class UpdateInquiryStatusDto {
  @IsEnum(['pending', 'replied', 'closed'] as InquiryStatus[])
  status: InquiryStatus
}
