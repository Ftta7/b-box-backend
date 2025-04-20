import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    private statusRepo: Repository<ShipmentStatus>,

    private readonly dispatchService: DispatchService,
  ) {}

  async create(dto: CreateShipmentDto) {
    const location = await this.locationsRepo.findOne({
      where: { id: dto.sender_location_id, tenant_id: dto.tenant_id },
    });
    if (!location) throw new NotFoundException('Invalid sender location');

    const shipmentId = randomUUID();

    const shipment = this.shipmentsRepo.create({
      id: shipmentId,
      tenant_id: dto.tenant_id,
      sender_location_id: dto.sender_location_id,
      to_address: dto.to_address,
      recipient_info: dto.recipient_info,
      status_code: 'pending',
      tracking_number: this.generateTrackingNumber(),
      items: dto.items || [],
    });

    const saved = await this.shipmentsRepo.save(shipment);

    await this.statusHistoryRepo.save({
      shipment_id: saved.id,
      status_code: 'pending',
      note: 'Shipment created',
    });

    await this.dispatchService.dispatchShipment(saved.id);

    return {
      message: 'Shipment created',
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
      status_history: history.map((h) => ({
        status_code: h.status_code,
        status_name: h.status.name_translations[lang],
        color: h.status.color,
        note: h.note,
        created_at: h.created_at,
      }))
    };
  }
}
