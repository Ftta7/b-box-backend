// src/modules/auth/dto/create-dashboard-user.dto.ts
import { IsEmail, IsString, IsOptional, IsUUID, IsIn } from 'class-validator';


export class CreateDashboardUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsIn(['admin', 'tenant'])
  role: 'admin' | 'tenant';

  @IsUUID()
  @IsOptional()
  tenant_id?: string;
}
