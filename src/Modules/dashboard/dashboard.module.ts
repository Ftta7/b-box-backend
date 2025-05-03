import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ShipmentsModule } from '../shipment/shipments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverCollection } from '../drivers/entities/driver-collection.entity';
import { ShipmentStatusHistory } from '../shipment/entities/shipment-status-history.entity';
import { ShipmentStatus } from '../shipment/entities/shipment-status.entity';
import { ShipmentType } from '../shipment/entities/shipment-type.entity';
import { Shipment } from '../shipment/entities/shipment.entity';
import { TenantLocation } from '../tenants/entities/tenant-location.entity';
import { Driver } from '../drivers/entities/driver.entity';
import { GlobalUser } from '../users/entities/global-user.entity';
import { DriversModule } from '../drivers/drivers.module';
import { TenantUser } from '../users/entities/tenant-user.entity';
import { TenantsModule } from '../tenants/tenants.module';
import { CarrierUser } from '../users/entities/carrier-user.entity';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [ShipmentsModule,DriversModule,TenantsModule,
        TypeOrmModule.forFeature([Shipment, ShipmentType, TenantLocation,ShipmentStatus ,ShipmentStatusHistory,DriverCollection ,Driver,GlobalUser,TenantUser ,CarrierUser ])
  ],
})
export class DashboardModule {}
