import { Controller, Post, Body, HttpCode, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { DriverLoginDto } from './dtos/driver-login.dto';
import { CreateDriverDto } from './dtos/create-driver.dto';
import { SuccessResponse, ErrorsResponse } from 'src/common/helpers/wrap-response.helper';
import { CreateDashboardUserDto } from './dtos/create-dashboard-user.dto';
import { LoginDashboardUserDto } from './dtos/login-dashboard-user.dto';
import { SendDriverOtpDto } from './dtos/send-driver-otp.dto';
import { VerifyDriverOtpDto } from './dtos/verify-driver-otp.dto';


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

  // ✅ Create dashboard user (admin or tenant)
  @Post('register-dashboard')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async registerDashboardUser(@Body() dto: CreateDashboardUserDto) {
    try {
      const result = await this.authService.createDashboardUser(dto);
      return SuccessResponse(result, 'Dashboard user registered successfully');
    } catch (error) {
      return ErrorsResponse(null, error.message);
    }
  }

  // ✅ Login dashboard user
  @Post('login-dashboard')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async loginDashboardUser(@Body() dto: LoginDashboardUserDto) {
    try {
      const token = await this.authService.loginDashboardUser(dto);
      return SuccessResponse({ token }, 'Login successful');
    } catch (error) {
      return ErrorsResponse(null, error.message);
    }
  }

  // ✅ إرسال OTP للسائق
  @Post('send-driver-otp')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async sendDriverOtp(@Body() dto: SendDriverOtpDto) {
    try {
      const result = await this.authService.sendDriverOtp(dto.phone_number);
      return SuccessResponse(result, 'OTP sent successfully');
    } catch (error) {
      return ErrorsResponse(null, error.message);
    }
  }

  // ✅ تسجيل دخول السائق عبر OTP
  @Post('login-driver-otp')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async driverLoginWithOtp(@Body() dto: VerifyDriverOtpDto) {
    try {
      const result = await this.authService.driverLoginWithOtp(dto.phone_number, dto.otp_code);
      return SuccessResponse(result, 'Login successful');
    } catch (error) {
      return ErrorsResponse(null, error.message);
    }
  }
}
