// src/modules/dashboard/dashboard.service.ts
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorsResponse, SuccessResponse } from 'src/common/helpers/wrap-response.helper';
import { In, Repository } from 'typeorm';
import { ShipmentStatus } from '../shipment/entities/shipment-status.entity';
import { Shipment } from '../shipment/entities/shipment.entity';
import { GlobalUser } from '../users/entities/global-user.entity';
import { Driver } from '../drivers/entities/driver.entity';
import { randomUUID } from 'crypto';
import { TenantUser } from '../users/entities/tenant-user.entity';
import { CarrierUser } from '../users/entities/carrier-user.entity';
import * as bcrypt from 'bcrypt';
import { CreateDashboardUserDto } from './create-dashboard-user.dto';
import { transformDriverShipments } from 'src/common/helpers/shipments.helper';
import { getPagination, toPaginationResponse } from 'src/common/helpers/pagination.helper';
import { ShipmentStatusFlow } from 'src/common/constants/shipment-status-flow';
import { plainToInstance } from 'class-transformer';
import { ShipmentDashboardDetailsDto } from '../shipment/dto/shipment-dashboard-details.dto';


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


    @InjectRepository(TenantUser)
    private readonly tenantUsersRepo: Repository<TenantUser>,

    @InjectRepository(CarrierUser)
    private readonly carrierUsersRepo: Repository<CarrierUser>,

    @InjectRepository(ShipmentStatus)
    private readonly shipmentStatusRepo: Repository<ShipmentStatus>,
  ) { }


  async getShipment(
    actor: { role: string; carrier_id?: string; tenant_id?: string },
    query: { page?: number; limit?: number; status_code?: string },
    language: 'ar' | 'en' = 'ar'
  ) {
    const { skip, take, page, limit } = getPagination(query);

    const where: any = {};

    if (query.status_code) {
      where.status_code = query.status_code;
    }

    // تصفية حسب نوع المستخدم
    switch (actor.role) {
      case 'admin':
        // لا قيود، يرى كل الشحنات
        break;
      case 'carrier':
        where.carrier_id = actor.carrier_id;
        break;
      case 'tenant':
        where.tenant_id = actor.tenant_id;
        break;
      default:
        throw new Error('Unauthorized or unknown role');
    }

    const [shipments, total] = await this.shipmentRepo.findAndCount({
      where,
      relations: ['status'],
      order: { created_at: 'DESC' },
      skip,
      take,
    });

    const data = transformDriverShipments(shipments, language); // أو دالة موحدة لو حاب

    return SuccessResponse(toPaginationResponse(data, total, page, limit));
  }


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

  async createDashboardUser(
    body: CreateDashboardUserDto,
    createdBy: any
  ) {
    const { email, password, tenant_id, carrier_id } = body;

    // تحقق من التكرار
    const existing = await this.usersRepo.findOne({ where: { email } });

    if (existing) {
      return ErrorsResponse(null, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepo.create({
      email,
      password_hash: hashedPassword,
      is_active: true,
    });

    // 🔍 تحديد الدور تلقائيًا حسب صلاحية المنشئ
    if (createdBy.role === 'admin') {
      if (tenant_id) {
        user.role = 'tenant';
      } else if (carrier_id) {
        user.role = 'carrier';
      } else {
        return ErrorsResponse(null, 'Admin must provide either tenant_id or carrier_id');
      }

    } else if (createdBy.role === 'carrier') {
      user.role = 'carrier';

    } else {
      return ErrorsResponse(null, 'You are not allowed to create users');
    }

    const savedUser = await this.usersRepo.save(user);

    // 🔗 إنشاء الربط مع الجهة
    if (user.role === 'tenant') {
      const tenantUser = this.tenantUsersRepo.create({
        id: randomUUID(),
        tenant_id,
        user_id: savedUser.id,
        role: 'admin',
        is_active: true,
      });
      await this.tenantUsersRepo.save(tenantUser);
    }

    if (user.role === 'carrier') {
      const resolvedCarrierId = createdBy.role === 'admin' ? carrier_id : createdBy.carrier_id;

      if (!resolvedCarrierId) {
        return ErrorsResponse(null, 'Missing carrier_id for carrier user');
      }

      const carrierUser = this.carrierUsersRepo.create({
        id: randomUUID(),
        carrier_id: resolvedCarrierId,
        global_user_id: savedUser.id,
        is_active: true,
      });
      await this.carrierUsersRepo.save(carrierUser);
    }

    return SuccessResponse({
      id: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    }, 'User created successfully');
  }

 async getShipmentDetails(
    shipmentId: string,
    lang: 'ar' | 'en' = 'en', // ← اللغة المطلوبة
  ) {
    const shipment = await this.shipmentRepo.findOne({
      where: { id: shipmentId },
      relations: ['status','tenant', 'carrier', 'driver','driver.user'],
    });
  
    if (!shipment) {
      throw new NotFoundException('Shipment not found for this driver');
    }
  
    const nextStatusCodes = ShipmentStatusFlow[shipment.status_code] || [];
  
    // ✅ جلب الحالات التالية بالتفاصيل
    const nextStatuses = await this.shipmentStatusRepo.findBy({
      code: In(nextStatusCodes),
    });
  
    const available_actions = nextStatuses.map((status) => ({
      code: status.code,
      name: status.name_translations[lang] || status.name_translations.en,
      color: status.color,
    }));
  
    
    return SuccessResponse( this.transformShipmentResponse(shipment,available_actions, lang));

  }


 transformShipmentResponse(shipment: any,available_actions:any, lang: 'ar' | 'en' = 'ar') {
    return {
      id: shipment.id,
      tracking_number: shipment.tracking_number,
      status: {
        code: shipment.status?.code,
        color: shipment.status?.color,
        name_: shipment.status?.name_translations?.[lang] || shipment.status?.name_translations?.en,
      },
      tenant: {
        id: shipment.tenant?.id,
        name: shipment.tenant?.name_translations?.[lang] || shipment.tenant?.name_translations?.en,
        phone: shipment.tenant?.phone || 'bbox',
        address: shipment.tenant?.address || null,
      },
      carrier:{
        id: shipment.carrier?.id || '--',
        name: shipment.carrier?.name || '--',
        logo_url: shipment.carrier?.logo_url || '--',
        contact_info: shipment.carrier?.contact_info || '--',
      },
      driver:  
      {
            id: shipment.driver?.id,
            name: shipment.driver?.user?.name || '--',  
            phone: shipment.driver?.user?.phone || '--',
      } ,
      from_address: shipment.from_address || {},
      to_address: shipment.to_address || {},
      recipient_info: shipment.recipient_info || {},
      delivery_fee: shipment.delivery_fee,
      platform_fee: shipment.platform_fee,
      tenant_payout: shipment.tenant_payout,
      cod_amount: shipment.cod_amount,
      shipment_value: shipment.shipment_value,
      total_amount: shipment.total_amount,
      payment_status: shipment.payment_status,
      actual_payment_type: shipment.actual_payment_type,
      created_at: shipment.created_at,
      updated_at: shipment.updated_at,
      delivered_at: shipment.delivered_at,
      items: shipment.items || [],
      available_actions: (available_actions || []).map(action => ({
        code: action.code,
        name: action.name,
        color: action.color,
      })),
    };
  }
  

}


