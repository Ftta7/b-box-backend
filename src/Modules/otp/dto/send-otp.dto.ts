import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum OtpContext {
  DRIVER = 'driver',
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

export class SendOtpDto {
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsEnum(OtpContext)
  context: OtpContext;

  @IsOptional()
  custom_expiry_minutes?: number;
}
