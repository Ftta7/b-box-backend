import { OtpContext } from '../dto/send-otp.dto';

export class Otp {
  phone_number: string;
  otp_code: string;
  context: OtpContext;
  expires_at: Date;
}
