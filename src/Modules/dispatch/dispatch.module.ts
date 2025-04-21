import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DispatchService } from './dispatch.service';
import { DispatchController } from './dispatch.controller';
import { DispatchRule } from './entities/dispatch-rule.entity';
import { Driver } from '../drivers/entities/driver.entity';
import { ShipmentStatusHistory } from '../shipment/entities/shipment-status-history.entity';
import { Shipment } from '../shipment/entities/shipment.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import { DriverCollection } from '../drivers/entities/driver-collection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DispatchRule, Shipment,
    Tenant,
    Driver,
    ShipmentStatusHistory,
    DriverCollection])],
  providers: [DispatchService],
  controllers: [DispatchController],
  exports: [DispatchService],
})
export class DispatchModule {}

