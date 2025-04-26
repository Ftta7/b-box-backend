import { Module } from '@nestjs/common';

// Import all modules
import { AuthModule } from './Modules/auth/auth.module';
import { DriversModule } from './Modules/drivers/drivers.module';
import { ShipmentsModule } from './Modules/shipment/shipments.module';
import { ProofsModule } from './Modules/proofs/proofs.module';
import { CancellationsModule } from './Modules/cancellations/cancellations.module';
import { ZonesModule } from './Modules/zones/zones.module';
import { HubsModule } from './Modules/hubs/hubs.module';
import { DispatchModule } from './Modules/dispatch/dispatch.module';
import { CollectionsModule } from './Modules/collections/collections.module';
import { TenantsModule } from './Modules/tenants/tenants.module';
import { TenantSettlementsModule } from './Modules/settlements/tenant-settlements.module';
import { DashboardModule } from './Modules/dashboard/dashboard.module';
import { CarriersModule } from './Modules/carriers/carriers.module';

@Module({
  imports: [
    AuthModule,
    DriversModule,
    ShipmentsModule,
    TenantSettlementsModule,
    ProofsModule,
    CancellationsModule,
    ZonesModule,
    HubsModule,
    DispatchModule,
    CollectionsModule,
    TenantsModule,
    DashboardModule,
    CarriersModule
  ],
})
export class ModulesAggregator {}
