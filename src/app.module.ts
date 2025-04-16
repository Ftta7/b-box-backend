import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
import { AuthModule } from './Modules/auth/auth.module';
import { DriversModule } from './Modules/drivers/drivers.module';
import { SettlementsModule } from './Modules/settlements/settlements.module';
import { ProofsModule } from './Modules/proofs/proofs.module';
import { CancellationsModule } from './Modules/cancellations/cancellations.module';
import { ZonesModule } from './Modules/zones/zones.module';
import { HubsModule } from './Modules/hubs/hubs.module';
import { DispatchModule } from './Modules/dispatch/dispatch.module';
import { CollectionsModule } from './Modules/collections/collections.module';
import { ShipmentsModule } from './Modules/shipment/shipments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true, // ✅ مهم جداً
      synchronize: true,
    }),
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
