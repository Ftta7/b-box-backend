import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Driver } from '../drivers/entities/driver.entity';
import { Shipment } from '../shipment/entities/shipment.entity';
import { ShipmentStatusHistory } from '../shipment/entities/shipment-status-history.entity';
import { DriverCollection } from '../drivers/entities/driver-collection.entity';
@Injectable()
export class DispatchService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentsRepo: Repository<Shipment>,

    @InjectRepository(Tenant)
    private readonly tenantsRepo: Repository<Tenant>,

    @InjectRepository(Driver)
    private readonly driversRepo: Repository<Driver>,

    @InjectRepository(ShipmentStatusHistory)
    private readonly statusHistoryRepo: Repository<ShipmentStatusHistory>,
  
    @InjectRepository(DriverCollection)
      private driverCollectionRepo: Repository<DriverCollection>,
  
  ) {}

  async dispatchShipment(shipmentId: string): Promise<{ status: string; driver_id?: string }> {
    const shipment = await this.shipmentsRepo.findOne({
      where: { id: shipmentId },
      relations: ['tenant'],
    });

    if (!shipment) throw new NotFoundException('Shipment not found');
    const tenant = shipment.tenant;

    // 🟡 التوصيل الذاتي
    if (tenant.delivery_mode === 'self') {
      await this.statusHistoryRepo.save({
        shipment_id: shipment.id,
        status_code: 'pending',
        note: `Self-delivery mode is enabled for tenant ${tenant.subdomain}`,
      });

      return { status: 'waiting-for-merchant-assignment' };
    }

    // 🔍 البحث عن سائق متاح في نفس المدينة
    const toCity = (shipment.to_address as any)?.city;
    const availableDrivers = await this.driversRepo.find({
      where: {
        is_active: true,
        is_bbox_driver: true,
     //   current_city: toCity,
      },
    });

    // ❌ لا يوجد سائق
    if (availableDrivers.length === 0) {
      await this.statusHistoryRepo.save({
        shipment_id: shipment.id,
        status_code: 'no_driver_available',
        note: `No BBox drivers available in ${toCity}`,
      });
      // الشحنة تظل في حالة pending
      return { status: 'pending' };
    }

    // ✅ سائق متاح - التعيين
    const selectedDriver = availableDrivers[0];

    shipment.driver_id = selectedDriver.id;
    shipment.status_code = 'assigned';
    await this.shipmentsRepo.save(shipment);

    await this.statusHistoryRepo.save({
      shipment_id: shipment.id,
      status_code: 'assigned',
      note: `Assigned to driver ID: ${selectedDriver.id}`,
    });

    if (
      shipment.actual_payment_type === 'cash' ||
      shipment.actual_payment_type === 'bank_transfer'
    ) {
      await this.driverCollectionRepo.save({
        driver_id: selectedDriver.id,
        shipment_id: shipment.id,
        amount: shipment.total_amount || 0,
        payment_type: shipment.actual_payment_type,
      });
    }
    

    return {
      status: 'assigned',
      driver_id: selectedDriver.id,
    };
  }
}
