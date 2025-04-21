import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TenantSettlement } from './entities/tenant-settlement.entity';
import { TenantSettlementsService } from './tenant-settlements.service';
import { TenantSettlementsController } from './tenant-settlements.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TenantSettlement])],
  providers: [TenantSettlementsService],
  controllers: [TenantSettlementsController],
  exports: [TenantSettlementsService],
})
export class TenantSettlementsModule {}
