import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './DTO/register.dto';
import { DriverLoginDto } from './DTO/driver-login.dto';
import { CreateDriverDto } from './DTO/create-driver.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @Post('register')
  @HttpCode(201)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login/driver')
  @HttpCode(200)
  loginDriver(@Body() dto: DriverLoginDto) {
    return this.authService.loginDriver(dto);
  }

  @Post('register/driver')
@HttpCode(201)
registerDriver(@Body() dto: CreateDriverDto) {
  return this.authService.registerDriver(dto);
}
}
