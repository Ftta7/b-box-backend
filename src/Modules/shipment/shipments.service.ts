import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Shipment } from './entities/shipment.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { randomUUID } from 'crypto';
import { TenantLocation } from '../tenants/entities/tenant-location.entity';
import { ShipmentType } from './entities/shipment-type.entity';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { ShipmentFilterDto } from './dto/shipment-filter.dto';
import { ShipmentListItemDto } from './dto/shipment-list-item.dto';
import { ShipmentDetailsDto } from './dto/shipment-details.dto';
import { ShipmentStatusHistory } from './entities/shipment-status-history.entity';
import { ShipmentStatus } from './entities/shipment-status.entity';
import { DispatchService } from '../dispatch/dispatch.service';
import { UpdateShipmentStatusDto } from './dto/update-shipment-status.dto';
import { DriverCollection } from '../drivers/entities/driver-collection.entity';
import { ShipmentStatusFlow } from 'src/common/constants/shipment-status-flow';
import { UpdateShipmentStatusByDriverDto } from './dto/update-shipment-status-by-driver.dto';
import { ErrorsResponse, SuccessResponse } from 'src/common/helpers/wrap-response.helper';
import { log } from 'console';
import { transformDriverShipments } from 'src/common/helpers/shipments.helper';
import { getPagination, toPaginationResponse } from 'src/common/helpers/pagination.helper';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment)
    private shipmentsRepo: Repository<Shipment>,

    @InjectRepository(TenantLocation)
    private locationsRepo: Repository<TenantLocation>,

    @InjectRepository(ShipmentType)
    private typesRepo: Repository<ShipmentType>,

    @InjectRepository(ShipmentStatusHistory)
    private statusHistoryRepo: Repository<ShipmentStatusHistory>,

    @InjectRepository(ShipmentStatus)
    private shipmentStatusRepo: Repository<ShipmentStatus>,

    private dispatchService: DispatchService,
  ) { }

  async create(dto: CreateShipmentDto) {
    // ✅ تحقق من sender_location_id فقط لو موجود
    if (dto.sender_location_id) {
      const location = await this.locationsRepo.findOne({
        where: { id: dto.sender_location_id, tenant_id: dto.tenant_id },
      });
      if (!location) {
        throw new NotFoundException('Invalid sender location');
      }
    }
  
    const shipmentId = randomUUID();
  
    const shipment = this.shipmentsRepo.create({
      id: shipmentId,
      tenant_id: dto.tenant_id,
      sender_location_id: dto.sender_location_id,
      from_address: dto.from_address, 
      to_address: dto.to_address,
      recipient_info: dto.recipient_info,
      items: dto.items || [],
      shipment_value: dto.shipment_value,
      delivery_fee: dto.delivery_fee ?? 0,
      total_amount: dto.total_amount ?? 0,
      actual_payment_type: dto.payment_type,
      payment_status: dto.payment_status,
      status_code: 'pending', // ✨ الحالة الافتراضية
      tracking_number: this.generateTrackingNumber(), // ✨ توليد رقم تتبع
    });
  
    const saved = await this.shipmentsRepo.save(shipment);
  
    // ✅ حفظ سجل الحالة الأولى (pending)
    await this.statusHistoryRepo.save({
      shipment_id: saved.id,
      status_code: 'pending',
      note: 'Shipment created',
    });
  
    // ✅ محاولة توزيع الشحنة للسائق مباشرة
    await this.dispatchService.dispatchShipment(saved.id);
  
    return {
      message: 'Shipment created successfully',
      tracking_number: saved.tracking_number,
      shipment_id: saved.id,
    };
  }
  

  async findAll() {
    return this.shipmentsRepo.find({
      relations: ['type'],
      order: { created_at: 'DESC' },
    });
  }

  private generateTrackingNumber(): string {
    const rand = Math.floor(100000 + Math.random() * 900000).toString();
    return `TRK-${rand}`;
  }

  async listShipments(
    filter: ShipmentFilterDto,
  ): Promise<PaginatedResult<ShipmentListItemDto>> {
    const query = this.shipmentsRepo.createQueryBuilder('s')
      .leftJoinAndSelect('s.status', 'status')
      .select([
        's.id',
        's.status_code',
        's.recipient_info',
        's.to_address',
        's.created_at',
        'status.name_translations',
        'status.color',
      ]);

    if (filter.tenant_id) {
      query.andWhere('s.tenant_id = :tenant_id', { tenant_id: filter.tenant_id });
    }

    if (filter.status_code) {
      query.andWhere('s.status_code = :status_code', { status_code: filter.status_code });
    }

    if (filter.city) {
      query.andWhere("s.to_address->>'city' = :city", { city: filter.city });
    }

    query.orderBy('s.created_at', 'DESC');

    query.skip(filter.offset || 0);
    query.take(filter.limit || 20);

    const [results, total] = await query.getManyAndCount();

    const data: ShipmentListItemDto[] = results.map((shipment) => ({
      id: shipment.id,
      status_name: shipment.status.name_translations['ar'],
      color: shipment.status.color,
      recipient_name: (shipment.recipient_info as any)?.name || '',
      to_city: (shipment.to_address as any)?.city || '',
      created_at: shipment.created_at,
    }));

    return { data, total };
  }

  async getShipmentDetails(id: string, tenant_id: string, lang: 'en' | 'ar' = 'ar'): Promise<ShipmentDetailsDto> {
    const shipment = await this.shipmentsRepo.findOne({
      where: { id, tenant_id },
      relations: ['status'],
    });

    if (!shipment) throw new NotFoundException('Shipment not found or access denied');

    const history = await this.statusHistoryRepo
      .createQueryBuilder('h')
      .leftJoinAndSelect('h.status', 'status')
      .where('h.shipment_id = :id', { id })
      .orderBy('h.created_at', 'ASC')
      .getMany();

    return {
      id: shipment.id,
      status_code: shipment.status_code,
      status_name: shipment.status.name_translations[lang],
      color: shipment.status.color,
      to_address: shipment.to_address,
      recipient_info: shipment.recipient_info,
      items: shipment.items,
      shipment_value: shipment.shipment_value,
      delivery_fee: shipment.delivery_fee,
      total_amount: shipment.total_amount,
      actual_payment_type: shipment.actual_payment_type,
      payment_status: shipment.payment_status,
      status_history: history.map((h) => ({
        status_code: h.status_code,
        status_name: h.status.name_translations[lang],
        color: h.status.color,
        note: h.note,
        created_at: h.created_at,
      })),
    };
  }

  async updateShipmentStatus(
    dto: UpdateShipmentStatusDto,
    tenant_id: string,
  ): Promise<{ message: string }> {
    const shipment = await this.shipmentsRepo.findOne({
      where: { id: dto.shipment_id, tenant_id },
    });

    if (!shipment) throw new NotFoundException('Shipment not found or access denied');

    // ✅ لو تم التوصيل والدفع عند التسليم
    if (dto.new_status_code === 'delivered') {
      if (
        shipment.actual_payment_type &&
        shipment.payment_status === 'pending' &&
        ['cash', 'bank_transfer'].includes(shipment.actual_payment_type)
      ) {
        shipment.payment_status = 'paid';
      }

      shipment.delivered_at = new Date();
    }

    shipment.status_code = dto.new_status_code;
    await this.shipmentsRepo.save(shipment);

    await this.statusHistoryRepo.save({
      shipment_id: shipment.id,
      status_code: dto.new_status_code,
      note: dto.note,
    });

    return { message: 'Shipment status updated' };
  }


  async getShipmentsListByDriver(driverId: string, query: { page?: number; limit?: number; status_code?: string }, language: 'ar' | 'en' = 'ar') {
    const { skip, take, page, limit } = getPagination(query);
  
    const where: any = { driver_id: driverId };
  
    if (query.status_code) {
      where.status_code = query.status_code;
    }
  
    const [shipments, total] = await this.shipmentsRepo.findAndCount({
      where,
      relations: ['status'],
      order: { created_at: 'DESC' },
      skip,
      take,
    });
  
    const data = transformDriverShipments(shipments, language);
  

  return SuccessResponse(  toPaginationResponse(data, total, page, limit) );
  }

 
  


  async getOneForDriver(
    driverId: string,
    shipmentId: string,
    lang: 'ar' | 'en' = 'en', // ← اللغة المطلوبة
  ) {
    const shipment = await this.shipmentsRepo.findOne({
      where: { id: shipmentId, driver_id: driverId },
      relations: ['status'],
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
  
    return {
      ...shipment,
      available_actions,
    };
  }
  
  async driverUpdateShipmentStatus(
    driverId: string,
    dto: UpdateShipmentStatusByDriverDto,
  ): Promise<{ message: string }> {
    const shipment = await this.shipmentsRepo.findOne({
      where: { id: dto.shipment_id, driver_id: driverId },
    });
  
    if (!shipment) {
      return ErrorsResponse(null, 'Shipment not found or not assigned to this driver');
    }
  
    const currentStatus = shipment.status_code;
  
    // 🚫 لا يسمح بتحديث الشحنة من الحالات النهائية
    const finalStatuses = ['delivered', 'failed', 'cancelled'];
    if (finalStatuses.includes(currentStatus)) {
      return ErrorsResponse(null, `Cannot update shipment with final status: ${currentStatus}`);
    }
  
    const availableActions = ShipmentStatusFlow[currentStatus] || [];
  
    if (!availableActions.includes(dto.new_status_code)) {
      return ErrorsResponse(null, `Invalid status transition from ${currentStatus} to ${dto.new_status_code}`);
    }
  
    // ⏱️ إعداد القيم للتحديث
    const updates: Partial<Shipment> = {
      status_code: dto.new_status_code,
    };
  
    if (dto.new_status_code === 'delivered') {
      updates.delivered_at = new Date();
  
      if (
        shipment.actual_payment_type &&
        shipment.payment_status === 'pending' &&
        ['cash', 'bank_transfer'].includes(shipment.actual_payment_type)
      ) {
        updates.payment_status = 'paid';
      }
    }
  
    // ✅ تحديث مباشر في قاعدة البيانات
    await this.shipmentsRepo.update(shipment.id, updates);
  
    // 📝 حفظ السجل في التاريخ
    await this.statusHistoryRepo.save({
      shipment_id: shipment.id,
      status_code: dto.new_status_code,
      note: dto.note,
    });
  
    return { message: 'Shipment status updated successfully' };
  }
  
  async getDriverShipmentStatusSummary(driverId: string, lang: 'ar' | 'en') {
    const statuses = await this.shipmentStatusRepo.find({
      where: { code: Not('pending') }, 
      order: { sort: 'ASC' },         
    });
  
    const counts = await this.shipmentsRepo
      .createQueryBuilder('s')
      .select('s.status_code', 'code')
      .addSelect('COUNT(*)', 'count')
      .where('s.driver_id = :driverId', { driverId })
      .groupBy('s.status_code')
      .getRawMany();
  
    const countMap = new Map(counts.map(c => [c.code, parseInt(c.count)]));
  
    return statuses.map(status => ({
      code: status.code,
      name: status.name_translations[lang] || status.name_translations.en,
      color: status.color,
      count: countMap.get(status.code) || 0,
    }));
  }
  
  async getShipmentDetailsByDriver(
    driverId: string,
    shipmentId: string,
    lang: 'ar' | 'en' = 'en', // ← اللغة المطلوبة
  ) {
    const shipment = await this.shipmentsRepo.findOne({
      where: { id: shipmentId, driver_id: driverId },
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
