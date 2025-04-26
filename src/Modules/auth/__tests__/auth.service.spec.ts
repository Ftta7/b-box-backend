import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GlobalUser } from '../../users/entities/global-user.entity';
import { TenantUser } from '../../users/entities/tenant-user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from '../dtos/register.dto';
import { Tenant } from 'src/Modules/tenants/entities/tenant.entity';

describe('AuthService', () => {
  let service: AuthService;
  let globalUsersRepo: Repository<GlobalUser>;
  let tenantUsersRepo: Repository<TenantUser>;
  let tenantsRepo: Repository<Tenant>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(GlobalUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(TenantUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Tenant),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    globalUsersRepo = module.get<Repository<GlobalUser>>(getRepositoryToken(GlobalUser));
    tenantUsersRepo = module.get<Repository<TenantUser>>(getRepositoryToken(TenantUser));
    tenantsRepo = module.get<Repository<Tenant>>(getRepositoryToken(Tenant));
  });

  it('should register a new user and tenant', async () => {
    const dto: RegisterDto = {
      email: 'test@example.com',
      password: 'password',
      subdomain: 'testtenant',
    };

    jest.spyOn(globalUsersRepo, 'findOne').mockResolvedValue(null);
    jest.spyOn(globalUsersRepo, 'create').mockReturnValue({} as any);
    jest.spyOn(globalUsersRepo, 'save').mockResolvedValue({ id: 'user-id' } as any);

    jest.spyOn(tenantsRepo, 'create').mockReturnValue({} as any);
    jest.spyOn(tenantsRepo, 'save').mockResolvedValue({ id: 'tenant-id' } as any);

    jest.spyOn(tenantUsersRepo, 'create').mockReturnValue({} as any);
    jest.spyOn(tenantUsersRepo, 'save').mockResolvedValue({} as any);

    const result = await service.register(dto);

    expect(globalUsersRepo.save).toHaveBeenCalled();
    expect(tenantsRepo.save).toHaveBeenCalled();
    expect(tenantUsersRepo.save).toHaveBeenCalled();
    expect(result).toEqual(
        expect.objectContaining({
          message: 'User registered successfully',
          api_key: expect.any(String), // أو تقدر تختبر القيمة الحقيقية لو معروفة
        }),
      );  });
});
