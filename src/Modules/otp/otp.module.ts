import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';

@Module({
  providers: [OtpService    
  ],
  exports: [OtpService],
  imports: [
    TypeOrmModule.forFeature([Otp])]
})
export class OtpModule {}
