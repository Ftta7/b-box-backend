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
import { DriverLocationModule } from './Modules/driver-tracking/driver-location.module';
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    // RedisModule.forRootAsync({
    //   useFactory: (): RedisModuleOptions => ({
    //     type: 'single',
    //     options: {
    //       host: 'rediss://red-d0991gs9c44c73db2v1g:4r8nOeT3LTB2Em9s08ZXFrhiNFwQNVpD@oregon-keyvalue.render.com',
    //       port: 6379,
    //     },
    //   }),
    // }),
    
    
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
    CarriersModule,
    // DriverLocationModule
  ],
})
export class ModulesAggregator {}
