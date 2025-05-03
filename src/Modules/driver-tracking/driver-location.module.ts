// src/modules/driver-tracking/driver-location.module.ts
import { Module } from '@nestjs/common';
import { DriverLocationService } from './driver-location.service';
import { DriverLocationGateway } from './driver-location.gateway';

@Module({
  providers: [DriverLocationService, DriverLocationGateway],
})
export class DriverLocationModule {}
