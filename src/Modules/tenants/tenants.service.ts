import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { generateApiKey, hashApiKey } from '../../utils/api-key.util';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly repo: Repository<Tenant>,
  ) {}

  findAll() {
    return this.repo.find();
  }



  async generateApiKey(tenantId: string): Promise<{ plainKey: string }> {
    const tenant = await this.repo.findOneByOrFail({ id: tenantId });
    const plainKey = generateApiKey();
    const hashedKey = await hashApiKey(plainKey);
    tenant.apiKeyHash = hashedKey;
    await this.repo.save(tenant);
    return { plainKey }; // أرسله لمرة واحدة فقط
  }
}
