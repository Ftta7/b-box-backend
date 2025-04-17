import { Module } from '@nestjs/common';

// Import all modules
import { AuthModule } from './Modules/auth/auth.module';
import { DriversModule } from './Modules/drivers/drivers.module';
import { ShipmentsModule } from './Modules/shipment/shipments.module';
import { SettlementsModule } from './Modules/settlements/settlements.module';
import { ProofsModule } from './Modules/proofs/proofs.module';
import { CancellationsModule } from './Modules/cancellations/cancellations.module';
import { ZonesModule } from './Modules/zones/zones.module';
import { HubsModule } from './Modules/hubs/hubs.module';
import { DispatchModule } from './Modules/dispatch/dispatch.module';
import { CollectionsModule } from './Modules/collections/collections.module';

@Module({
  imports: [
    AuthModule,
    DriversModule,
    ShipmentsModule,
    SettlementsModule,
    ProofsModule,
    CancellationsModule,
    ZonesModule,
    HubsModule,
    DispatchModule,
    CollectionsModule,
  ],
})
export class ModulesAggregator {}
