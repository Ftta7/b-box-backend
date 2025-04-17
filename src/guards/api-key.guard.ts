import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Tenant } from '../Modules/tenants/entities/tenant.entity';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.header('x-api-key');

    if (!apiKey) {
      console.log('\x1b[31m[API-GUARD]\x1b[0m ❌ Missing API key');
      throw new UnauthorizedException('Missing API key');
    }

    const tenantRepo = this.dataSource.getRepository(Tenant);
    const tenant = await tenantRepo.findOne({ where: { api_key: "69abec656fc95d0b7ebd48e4c3cd525ced8044193b50295e3c53ec039697cb61" } });

    if (!tenant) {
      console.log(`\x1b[33m[API-GUARD]\x1b[0m 🔑 Invalid API key: ${apiKey}`);
      throw new UnauthorizedException('Invalid API key');
    }

    console.log(`\x1b[32m[API-GUARD]\x1b[0m ✅ Authenticated tenant: ${tenant.subdomain} (${tenant.id})`);

    request['tenant_id'] = tenant.id;
    return true;
  }
}
