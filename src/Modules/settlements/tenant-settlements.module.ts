import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantSettlementsService } from './tenant-settlements.service';
import { Shipment } from '../shipment/entities/shipment.entity';
import { TenantSettlementsController } from './tenant-settlements.controller';
import { TenantSettlement } from './entities/tenant-settlement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TenantSettlement,   // ✅ ضيف هذا
      Shipment,           // ✅ لأنك مستخدمه برضو
    ]),
  ],
  controllers: [TenantSettlementsController],
  providers: [TenantSettlementsService],
  exports: [TenantSettlementsService], // ✅ عشان تقدر تستخدمه في modules تانية
})
export class TenantSettlementsModule {}
