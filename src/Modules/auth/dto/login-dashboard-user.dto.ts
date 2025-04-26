// src/modules/auth/dto/login-dashboard-user.dto.ts
import { IsEmail, IsString } from 'class-validator';

export class LoginDashboardUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
