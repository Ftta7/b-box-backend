import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { Tenant } from '../../Modules/tenants/entities/tenant.entity';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor(private readonly dataSource: DataSource) {}

  async use(req: Request & { tenant_id?: string }, res: Response, next: NextFunction) {
    const apiKey = req.header('x-api-key');

    if (!apiKey) {
      throw new UnauthorizedException('API key is required in the "x-api-key" header.');
    }

    const tenant = await this.dataSource.getRepository(Tenant).findOneBy({ api_key: apiKey });

    if (!tenant) {
      throw new UnauthorizedException('Invalid API key.');
    }

    req.tenant_id = tenant.id;
    next();
  }
}
