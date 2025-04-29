import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalUser } from '../users/entities/global-user.entity';
import { TenantUser } from '../users/entities/tenant-user.entity';
import { Tenant } from 'src/Modules/tenants/entities/tenant.entity';
import { JwtStrategy } from 'src/authintication/jwt.strategy';
import { Driver } from '../drivers/entities/driver.entity';
import { OtpModule } from '../otp/otp.module'; // ✨
import { NotificationModule } from '../notifications/notification.module';
 
@Module({
  imports: [
    ConfigModule,
    OtpModule, 
    NotificationModule,// ✨ استوردناه هنا بشكل صحيح
    TypeOrmModule.forFeature([GlobalUser, TenantUser, Tenant, Driver]),
    JwtModule.registerAsync({
      imports: [ConfigModule], // ✨ فقط ConfigModule هنا
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
