import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyDriverOtpDto {
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  otp_code: string;
}
