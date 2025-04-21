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

    // 🚫 إذا التاجر يعتمد على نفسه بالتوصيل
    if (tenant.delivery_mode === 'self') {
      await this.updateShipmentStatus(shipment, 'waiting-for-merchant-assignment', 'التوصيل ذاتي بانتظار التاجر');
      return { status: 'waiting-for-merchant-assignment' };
    }

    // 🧠 حاول تعيين سائق من BBox
    const assigned = await this.assignAvailableDriver(shipment);

    if (!assigned) {
      await this.updateShipmentStatus(shipment, 'no_driver_available', 'لا يوجد سائق متاح حاليًا');
      return { status: 'no_driver_available' };
    }

    // ✅ نجاح التعيين
    shipment.driver_id = assigned.id;
    shipment.status_code = 'assigned';
    await this.shipmentsRepo.save(shipment);
    await this.updateShipmentStatus(shipment, 'assigned', `تم تعيين السائق ${assigned.full_name}`);

    return {
      status: 'assigned',
      driver_id: assigned.id,
    };
  }

  private async assignAvailableDriver(shipment: Shipment): Promise<Driver | null> {
    const city = (shipment.to_address as any)?.city;

    const availableDrivers = await this.driversRepo.find({
      where: {
        is_active: true,
        is_bbox_driver: true,
       // current_city: city,
      },
    });

    return availableDrivers.length > 0 ? availableDrivers[0] : null;
  }

  private async updateShipmentStatus(
    shipment: Shipment,
    newStatus: string,
    note?: string,
  ): Promise<void> {
    shipment.status_code = newStatus;
    await this.shipmentsRepo.save(shipment);

    await this.statusHistoryRepo.save({
      shipment_id: shipment.id,
      status_code: newStatus,
      note,
    });
  }
}
