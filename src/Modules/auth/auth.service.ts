// src/modules/auth/auth.service.ts
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlobalUser } from '../users/entities/global-user.entity';
import { TenantUser } from '../users/entities/tenant-user.entity';
import * as bcrypt from 'bcrypt';
import { randomUUID, randomBytes } from 'crypto';
import { Tenant } from 'src/Modules/tenants/entities/tenant.entity';
import { RegisterDto } from './dtos/register.dto';
import { Driver } from '../drivers/entities/driver.entity';
import { CreateDriverDto } from './dtos/create-driver.dto';
import { SuccessResponse } from 'src/common/helpers/wrap-response.helper';
import { OtpService } from '../otp/otp.service'; // ✨ إضافة OtpService
import { OtpContext } from '../otp/dto/send-otp.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/notification-type.enum';
import { CarrierUser } from '../users/entities/carrier-user.entity';

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

    @InjectRepository(Driver)
    private driversRepo: Repository<Driver>,

    @InjectRepository(CarrierUser)
    private carrierUsersRepo: Repository<CarrierUser>,

    

    private readonly otpService: OtpService, 

    private readonly notificationsService: NotificationsService
  ) {}

  // ✅ تسجيل دخول المستخدمين (بريد إلكتروني وكلمة مرور)
  async login({ email, password }: { email: string; password: string }) {
    const user = await this.globalUsersRepo.findOne({ where: { email } });
  
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const payload: any = { sub: user.id };
    const role = user.role;
  
    if (role === 'tenant') {
      const tenantLink = await this.tenantUsersRepo.findOne({
        where: { user_id: user.id, is_active: true },
      });
      if (!tenantLink) throw new UnauthorizedException('No active tenant access');
  
      Object.assign(payload, {
        role: 'tenant',
        tenant_id: tenantLink.tenant_id,
      });
  
    } else if (role === 'carrier') {
      const carrierLink = await this.carrierUsersRepo.findOne({
        where: { global_user_id: user.id, is_active: true },
      });
      if (!carrierLink) throw new UnauthorizedException('No active carrier access');
  
      Object.assign(payload, {
        role: 'carrier',
        carrier_id: carrierLink.id,
      });
  
    } else if (role === 'admin') {
      payload.role = 'admin';
  
    } else {
      throw new UnauthorizedException('Invalid user role');
    }
  
    const access_token = this.jwtService.sign(payload);
    return SuccessResponse({ access_token }, 'Login successful');
  }
  

  // ✅ تسجيل مستخدم جديد
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

    let api_key: string | undefined;

    if (dto.subdomain) {
      const tenantId = randomUUID();

      api_key = randomBytes(32).toString('hex');

      const tenant = this.tenantsRepo.create({
        id: tenantId,
        subdomain: dto.subdomain,
        name_translations: {
          en: dto.subdomain,
          ar: dto.subdomain,
        },
        api_key,
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

    return {
      success: true,
      message: 'User registered successfully',
      data: api_key ? { api_key } : null,
    };
  }

  // ✅ تحقق من بيانات سائق قديم (بالرقم السري التقليدي)
  async validateDriver(phone: string, password: string) {
    const user = await this.globalUsersRepo.findOne({ where: { phone } });

    if (!user || user.role !== 'driver') {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const driver = await this.driversRepo.findOne({
      where: { user_id: user.id, is_active: true },
    });

    if (!driver) {
      throw new NotFoundException('Driver record not found');
    }

    return { user, driver };
  }

  // ✅ تسجيل دخول السائقين بكلمة المرور التقليدية
  async loginDriver({ phone, password }: { phone: string; password: string }) {
    const { user, driver } = await this.validateDriver(phone, password);

    const payload = {
      sub: user.id,
      role: user.role,
      driver_id: driver.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      driver: {
        id: driver.id,
        tenant_id: driver.tenant_id,
        is_bbox_driver: driver.is_bbox_driver,
        payment_type: driver.payment_type,
      },
    };
  }

  // ✅ تسجيل سائق جديد
  async registerDriver(dto: CreateDriverDto) {
    const exists = await this.globalUsersRepo.findOne({
      where: { phone: dto.phone },
    });

    if (exists) throw new ConflictException('Phone already registered');

    const user = this.globalUsersRepo.create({
      phone: dto.phone,
      name: dto.full_name,
      password_hash: await bcrypt.hash(dto.password, 10),
      is_active: true,
      role: 'driver',
    });

    const savedUser = await this.globalUsersRepo.save(user);

    const commissionRate =
      dto.payment_type === 'commission' ? dto.commission_rate ?? 0 : 0;

    const driver = this.driversRepo.create({
      user_id: savedUser.id,
      tenant_id: dto.tenant_id,
      is_bbox_driver: dto.is_bbox_driver ?? false,
      payment_type: dto.payment_type ?? 'salary',
      commission_rate: commissionRate,
    });

    const savedDriver = await this.driversRepo.save(driver);

    return {
      success: true,
      message: 'Driver registered successfully',
      data: {
        driver_id: savedDriver.id,
        user_id: savedUser.id,
        name: savedUser.name,
        phone: savedUser.phone,
        tenant_id: savedDriver.tenant_id,
        payment_type: savedDriver.payment_type,
        commission_rate: savedDriver.commission_rate,
      },
    };
  }


  

  // ✅ تسجيل دخول مستخدم لوحة تحكم
  async loginDashboardUser(body: any): Promise<string> {
    const { email, password } = body;
    const user = await this.globalUsersRepo.findOne({ where: { email } });

    if (!user || !user.is_active || !(await bcrypt.compare(password, user.password_hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tenantUser = await this.tenantUsersRepo.findOne({
      where: { user_id: user.id, is_active: true },
    });

    const payload = {
      sub: user.id,
      role: user.role,
      tenant_id: tenantUser?.tenant_id ?? null,
    };

    return this.jwtService.sign(payload);
  }

  // ✅ إرسال كود OTP للسائق
  async sendDriverOtp(phone_number: string) {
    const user = await this.globalUsersRepo.findOne({
      where: { phone: phone_number },
    });
  
    if (!user || user.role !== 'driver') {
      throw new NotFoundException('Driver user not found');
    }
  
    const driver = await this.driversRepo.findOne({
      where: { user_id: user.id, is_active: true },
    });
  
    if (!driver) {
      throw new NotFoundException('Driver record not found');
    }
  
    // ✨ توليد كود OTP
    const otpCode = await this.otpService.sendOtp({
      phone_number,
      context: OtpContext.DRIVER,
    });
  
    // ✨ إرسال الكود عبر WhatsApp
    await this.notificationsService.sendNotification({
      type: NotificationType.WHATSAPP,
      recipient: "966547305033",
      message: `رمز التحقق الخاص بك هو: ${otpCode}`,
    });
  
    return null;
  }
  

  // ✅ تسجيل دخول سائق عبر OTP
  async driverLoginWithOtp(phone_number: string, otp_code: string) {
    const user = await this.globalUsersRepo.findOne({
      where: { phone: phone_number },
    });
  
    if (!user || user.role !== 'driver') {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const driver = await this.driversRepo.findOne({
      where: { user_id: user.id, is_active: true },
    });
  
    if (!driver) {
      throw new UnauthorizedException('Driver record not found');
    }
  
    const isOtpValid = await this.otpService.verifyOtp({
      phone_number,
      otp_code,
      context: OtpContext.DRIVER,
    });
    
  
    if (!isOtpValid) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }
  
    const payload = {
      sub: user.id,
      role: user.role,
      driver_id: driver.id,
    };
  
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      driver: {
        id: driver.id,
        tenant_id: driver.tenant_id,
        is_bbox_driver: driver.is_bbox_driver,
        payment_type: driver.payment_type,
      },
    };
  }
  
}
