// src/guards/dashboard.guard.ts
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class DashboardGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as any;

    if (!user || !['admin', 'tenant', 'carrier'].includes(user.role)) {
      throw new ForbiddenException('Access to dashboard is restricted');
    }

    return true;
  }
}
