// src/modules/dashboard/dashboard.controller.ts
import { Controller, Get, Req, UseGuards, ForbiddenException, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';
import { DashboardGuard } from 'src/guards/dashboard.guard';
import { Request } from 'express';
import { SuccessResponse } from 'src/common/helpers/wrap-response.helper';
import { DriversService } from '../drivers/drivers.service';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'), DashboardGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService,private readonly driversService: DriversService) {}

  // ✅ Endpoint: Dashboard Summary
  @Get('summary')
  async getDashboardSummary(@Req() req: Request) {
    const user = req.user as any;

    if (user.role === 'admin') {
      return this.dashboardService.getAdminDashboard();
    } else if (user.role === 'tenant') {
      return this.dashboardService.getTenantDashboard(user.tenant_id);
    } else {
      throw new ForbiddenException('Unauthorized user');
    }
  }

  // ✅ Endpoint: Daily Shipments Stats
  @Get('daily-shipments')
  async getDailyShipments(@Req() req: Request) {
    const user = req.user as any;

    if (user.role === 'admin') {
      return this.dashboardService.getDailyShipments('admin');
    } else if (user.role === 'tenant') {
      return this.dashboardService.getDailyShipments('tenant', user.tenant_id);
    } else {
      throw new ForbiddenException('Unauthorized user');
    }
  }
  @Get('drivers')
  async listDrivers(
    @Req() req: Request,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    const user = req.user as any;
    const result = await this.dashboardService.getDriversList({
      page: Number(page),
      limit: Number(limit),
      search,
      role: user.role,
      tenant_id: user.tenant_id,
    });
    return SuccessResponse(result, 'Drivers list retrieved');
  }
}
