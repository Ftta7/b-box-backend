import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { OtpContext } from './send-otp.dto';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  otp_code: string;

  @IsEnum(OtpContext)
  context: OtpContext;
}
