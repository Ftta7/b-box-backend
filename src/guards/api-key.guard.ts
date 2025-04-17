import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Request } from 'express';
  import { InjectDataSource } from '@nestjs/typeorm';
  import { DataSource } from 'typeorm';
  import { Tenant } from '../Modules/tenants/entities/tenant.entity';
  import { verifyApiKey } from '../utils/api-key.util';
import { log } from 'console';
  
  @Injectable()
  export class ApiKeyGuard implements CanActivate {
    constructor(@InjectDataSource() private dataSource: DataSource) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const apiKey = request.header('x-api-key');
console.log(`API Key: ${apiKey}`);
      if (!apiKey) throw new UnauthorizedException('Missing API key');
  
      const tenantRepo = this.dataSource.getRepository(Tenant);
      const tenants = await tenantRepo.find();
  
      const matchedTenant = await Promise.any(
        tenants.map(async (tenant) =>
          (await verifyApiKey(apiKey, tenant.apiKeyHash)) ? tenant : Promise.reject(),
        ),
      ).catch(() => null);
  
      if (!matchedTenant) throw new UnauthorizedException('Invalid API key');
  
      request['tenant_id'] = matchedTenant.id;
      return true;
    }
  }
  