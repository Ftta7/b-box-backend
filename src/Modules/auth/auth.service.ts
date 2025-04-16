import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlobalUser } from '../users/entities/global-user.entity';
import { TenantUser } from '../users/entities/tenant-user.entity';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Tenant } from 'src/Modules/tenants/entities/tenant.entity';
import { RegisterDto } from './DTO/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,

    @InjectRepository(GlobalUser)
    private globalUsersRepo: Repository<GlobalUser>,

    @InjectRepository(TenantUser)
    private tenantUsersRepo: Repository<TenantUser>,

    @InjectRepository(Tenant)
    private tenantsRepo: Repository<Tenant>,
  ) {}

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.globalUsersRepo.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tenantLink = await this.tenantUsersRepo.findOne({
      where: { user_id: user.id, is_active: true },
    });

    if (!tenantLink) {
      throw new UnauthorizedException('No active tenant access');
    }

    const payload = {
      sub: user.id,
      tenant_id: tenantLink.tenant_id,
      role: tenantLink.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.globalUsersRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const userId = randomUUID();
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.globalUsersRepo.create({
      id: userId,
      email: dto.email,
      password_hash: passwordHash,
      is_active: true,
    });
    await this.globalUsersRepo.save(user);

    if (dto.subdomain) {
      const tenantId = randomUUID();

      const tenant = this.tenantsRepo.create({
        id: tenantId,
        subdomain: dto.subdomain,
        name_translations: {
          en: dto.subdomain,
          ar: dto.subdomain,
        },
        created_at: new Date(),
      });
      await this.tenantsRepo.save(tenant);

      const tenantUser = this.tenantUsersRepo.create({
        id: randomUUID(),
        tenant_id: tenantId,
        user_id: userId,
        role: 'admin',
        is_active: true,
      });
      await this.tenantUsersRepo.save(tenantUser);
    }

    return { message: 'User registered successfully' };
  }
}

