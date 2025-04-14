import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(user: { user_id: string; tenant_id: string; role: string }) {
    const payload = {
      sub: user.user_id,
      tenant_id: user.tenant_id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
