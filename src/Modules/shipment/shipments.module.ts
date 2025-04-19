import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentsService } from './shipments.service';
import { ShipmentsController } from './shipments.controller';
import { Shipment } from './entities/shipment.entity';
import { ShipmentType } from './entities/shipment-type.entity';
import { TenantLocation } from '../tenants/entities/tenant-location.entity';
import { ShipmentStatus } from './entities/shipment-status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shipment, ShipmentType, TenantLocation,ShipmentStatus    ])
  ],
  controllers: [ShipmentsController],
  providers: [ShipmentsService],
})
export class ShipmentsModule {}

