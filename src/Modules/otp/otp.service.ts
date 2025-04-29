import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { SendOtpDto, OtpContext } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Otp } from './entities/otp.entity';

@Injectable()
export class OtpService {
  private otps: Otp[] = [];

  async sendOtp(dto: SendOtpDto): Promise<string> { // ✨ بدل void ➔ string
    let otpCode: string;
  
    if (process.env.NODE_ENV === 'development') {
      otpCode = '1111';
    } else {
      otpCode = randomInt(1000, 9999).toString();
    }
  
    const expiresAt = new Date(Date.now() + (dto.custom_expiry_minutes ?? 5) * 60 * 1000);
  
    // حذف أي OTP قديم لنفس الرقم + السياق
    this.otps = this.otps.filter(
      (o) => !(o.phone_number === dto.phone_number && o.context === dto.context)
    );
  
    // إضافة OTP جديد
    this.otps.push({
      phone_number: dto.phone_number,
      otp_code: otpCode,
      context: dto.context,
      expires_at: expiresAt,
    });
  
    console.log(`OTP for ${dto.phone_number}: ${otpCode}`);
  
    return otpCode; // ✨ رجع الكود
  }
  

  async verifyOtp(dto: VerifyOtpDto): Promise<boolean> {
    const otpEntryIndex = this.otps.findIndex(
      (o) => o.phone_number === dto.phone_number && o.context === dto.context
    );
  
    if (otpEntryIndex === -1) {
      return false;
    }
  
    const otpEntry = this.otps[otpEntryIndex];
  
    if (otpEntry.expires_at < new Date()) {
      return false;
    }
  
    const isValid = otpEntry.otp_code === dto.otp_code;
  
    if (isValid) {
      // حذف الـ OTP بعد التحقق الناجح
      this.otps.splice(otpEntryIndex, 1);
    }
  
    return isValid;
  }
  
}
