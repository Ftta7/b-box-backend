import { IsEmail, IsString, IsNotEmpty, MinLength, IsOptional, IsUUID, IsPhoneNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDashboardUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the new user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'Password for the new user (minimum 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'Ali Ahmed',
    description: 'Full name of the user',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '+966512345678',
    description: 'Phone number in international format',
  })
  @IsPhoneNumber()
  phone: string;

  @ApiPropertyOptional({
    example: 'uuid-of-tenant',
    description: 'Tenant ID (required only if admin is creating a tenant user)',
  })
  @IsOptional()
  @IsUUID()
  tenant_id?: string;

  @ApiPropertyOptional({
    example: 'uuid-of-carrier',
    description: 'Carrier ID (required only if admin is creating a carrier user)',
  })
  @IsOptional()
  @IsUUID()
  carrier_id?: string;
}
