import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  mockLogin(@Body() body: { email: string }) {
    return this.authService.login({
      user_id: 'user-123',
      tenant_id: 'tenant-abc',
      role: 'admin',
    });
  }
}
