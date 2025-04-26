import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { Driver } from './entities/driver.entity';
import { Shipment } from '../shipment/entities/shipment.entity';
import { ShipmentsModule } from '../shipment/shipments.module';

@Module({
  imports: [TypeOrmModule.forFeature([Driver,Shipment]),
ShipmentsModule],
  providers: [DriversService],
  controllers: [DriversController],
  exports: [DriversService],
})
export class DriversModule {}
