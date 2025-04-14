import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const exemptPaths = ['/auth', '/public'];

    // ✅ تخطى المسارات المستثناة
    if (exemptPaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    const tenantId = req.header('x-tenant-id');

    if (!tenantId || typeof tenantId !== 'string' || tenantId.trim() === '') {
      return res.status(400).json({
        statusCode: 400,
        message: 'Missing or invalid X-Tenant-ID header',
      });
    }

    req['tenant_id'] = tenantId.trim();
    next();
  }
}
