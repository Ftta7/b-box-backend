// src/modules/dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuccessResponse } from 'src/common/helpers/wrap-response.helper';
import { Repository } from 'typeorm';
import { ShipmentStatus } from '../shipment/entities/shipment-status.entity';
import { Shipment } from '../shipment/entities/shipment.entity';
import { GlobalUser } from '../users/entities/global-user.entity';
import { Driver } from '../drivers/entities/driver.entity';


@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepo: Repository<Shipment>,

    @InjectRepository(ShipmentStatus)
    private readonly statusRepo: Repository<ShipmentStatus>,

  
        @InjectRepository(Driver)
        private readonly driversRepo: Repository<Driver>,
    
        @InjectRepository(GlobalUser)
        private readonly usersRepo: Repository<GlobalUser>,

  ) {}

  // ✅ Tenant Dashboard Summary
  async getTenantDashboard(tenantId: string) {
    const totalShipments = await this.shipmentRepo.count({ where: { tenant_id: tenantId } });

    const byStatus = await this.shipmentRepo
      .createQueryBuilder('shipment')
      .select('shipment.status_code', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('shipment.tenant_id = :tenantId', { tenantId })
      .groupBy('shipment.status_code')
      .getRawMany();

    const deliveredStatus = await this.statusRepo.findOne({ where: { code: 'delivered' } });

    const codToday = await this.shipmentRepo
      .createQueryBuilder('shipment')
      .select('COALESCE(SUM(shipment.cod_amount), 0)', 'total_cod')
      .where('shipment.tenant_id = :tenantId', { tenantId })
      .andWhere('shipment.status_code = :statusCode', { statusCode: deliveredStatus?.code })
      .andWhere('DATE(shipment.delivered_at) = CURRENT_DATE')
      .getRawOne();

    return SuccessResponse({
      totalShipments,
      codToday: Number(codToday.total_cod || 0),
      statusBreakdown: byStatus.reduce((acc, row) => {
        acc[row.status] = parseInt(row.count, 10);
        return acc;
      }, {} as Record<string, number>),
    }, 'Tenant dashboard summary loaded');
  }

  // ✅ Admin Dashboard Summary
  async getAdminDashboard() {
    const totalShipments = await this.shipmentRepo.count();

    const byStatus = await this.shipmentRepo
      .createQueryBuilder('shipment')
      .select('shipment.status_code', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('shipment.status_code')
      .getRawMany();

    return SuccessResponse({
      totalShipments,
      statusBreakdown: byStatus.reduce((acc, row) => {
        acc[row.status] = parseInt(row.count, 10);
        return acc;
      }, {} as Record<string, number>),
    }, 'Admin dashboard summary loaded');
  }

  // ✅ Daily Shipments (Admin or Tenant)
  async getDailyShipments(role: string, tenantId?: string) {
    const qb = this.shipmentRepo.createQueryBuilder('shipment')
      .select("TO_CHAR(shipment.created_at, 'YYYY-MM-DD')", 'date')
      .addSelect('COUNT(*)', 'count')
      .groupBy("TO_CHAR(shipment.created_at, 'YYYY-MM-DD')")
      .orderBy('date', 'ASC')
      .limit(7);

    if (role === 'tenant' && tenantId) {
      qb.where('shipment.tenant_id = :tenantId', { tenantId });
    }

    const raw = await qb.getRawMany();

    const labels = raw.map(row => row.date);
    const series = raw.map(row => parseInt(row.count, 10));

    return SuccessResponse({
      labels,
      series,
    }, 'Daily shipment stats loaded');
  }

  
  async getDriversList({ page, limit, search, role, tenant_id }: {
    page: number,
    limit: number,
    search?: string,
    role: string,
    tenant_id?: string
  }) {
    const skip = (page - 1) * limit;

    const query = this.driversRepo.createQueryBuilder('driver')
      .leftJoinAndSelect('driver.user', 'user')
      .orderBy('user.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    if (role === 'tenant') {
      query.andWhere('driver.tenant_id = :tenant_id', { tenant_id });
    }

    if (search) {
      query.andWhere('(user.name ILIKE :search OR user.phone ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query.getManyAndCount();
    return {
        data: data.map(d => ({
          id: d.id,
          name: d.user?.name,
          phone: d.user?.phone,
          tenant_id: d.tenant_id,
          is_bbox_driver: d.is_bbox_driver,
          payment_type: d.payment_type,
          commission_rate: d.commission_rate,
          created_at: d.created_at,
        })),
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      };
  }
}
