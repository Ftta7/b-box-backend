import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { Tenant } from '../../Modules/tenants/entities/tenant.entity';
import { verifyApiKey } from '../../utils/api-key.util'; // تأكد من وجود هذه الدالة في ملف utils/api-key.util.ts
@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor(private dataSource: DataSource) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // const apiKey = req.header('x-api-key');
    // if (!apiKey) throw new UnauthorizedException('Missing API key');

    // const tenantRepo = this.dataSource.getRepository(Tenant);
    // const tenants = await tenantRepo.find(); // يمكن تحسينه لو عندك index

    // const matchedTenant = await Promise.any(
    //   tenants.map(async (tenant) =>
    //     (await verifyApiKey(apiKey, tenant.api_key)) ? tenant : Promise.reject(),
    //   ),
    // ).catch(() => null);

    // if (!matchedTenant) throw new UnauthorizedException('Invalid API key');

    // req['tenant_id'] = matchedTenant.id;
    next();
  }
}
