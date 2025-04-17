import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from './entities/shipment.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { randomUUID } from 'crypto';
import { TenantLocation } from '../tenants/entities/tenant-location.entity';
import { ShipmentType } from './entities/shipment-type.entity';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment)
    private shipmentsRepo: Repository<Shipment>,

    @InjectRepository(TenantLocation)
    private locationsRepo: Repository<TenantLocation>,

    @InjectRepository(ShipmentType)
    private typesRepo: Repository<ShipmentType>,
  ) {}

  async create(dto: CreateShipmentDto, tenant_id: string) {
    // تأكد من صلاحية موقع المرسل
    const location = await this.locationsRepo.findOne({
      where: { id: dto.sender_location_id, tenant_id },
    });
    if (!location) throw new NotFoundException('Invalid sender location');

    // تأكد من نوع الشحنة
    const shipmentType = await this.typesRepo.findOne({
      where: { id: dto.shipment_type_id },
    });
    if (!shipmentType) throw new NotFoundException('Invalid shipment type');

    const shipmentId = randomUUID();

    const shipment = this.shipmentsRepo.create({
      id: shipmentId,
      tenant_id,
      sender_location_id: dto.sender_location_id,
      to_address: dto.to_address, // تأكد إنها object وليس string
      recipient_info: dto.recipient_info,
      type_code: dto.shipment_type_id, // لو اسم الحقل type_code
      status: 'pending',
      tracking_number: this.generateTrackingNumber(),
    });
    
    const saved = await this.shipmentsRepo.save(shipment);
    
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
}
