import { IsString, MinLength, MaxLength } from 'class-validator'

export class CreateInquiryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(5000)
  message: string
}
