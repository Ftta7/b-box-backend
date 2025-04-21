import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { IsNull, Repository } from 'typeorm';
  import { Shipment } from '../shipment/entities/shipment.entity';
import { TenantSettlement } from './entities/tenant-settlement.entity';
  
  @Injectable()
  export class TenantSettlementsService {
    constructor(
      @InjectRepository(TenantSettlement)
      private readonly settlementsRepo: Repository<TenantSettlement>,
  
      @InjectRepository(Shipment)
      private readonly shipmentsRepo: Repository<Shipment>,
    ) {}
  
    async generateTenantSettlement(tenant_id: string): Promise<{ settlement_id: string }> {
      const unpaidShipments = await this.shipmentsRepo.find({
        where: {
          tenant_id,
          settlement_id: IsNull(),
          payment_status: 'paid',
        },
        order: { created_at: 'ASC' },
      });
    
      if (!unpaidShipments.length) {
        throw new BadRequestException('No paid shipments available for settlement');
      }
    
      const period_start = unpaidShipments[0].created_at;
      const period_end = new Date();
    
      // ✅ الحسابات المالية
      const total_collected = unpaidShipments.reduce(
        (sum, s) => sum + (s.total_amount || 0),
        0,
      );
    
      const tenant_share = unpaidShipments.reduce(
        (sum, s) => sum + ((s.total_amount || 0) - (s.delivery_fee || 0)),
        0,
      );
    
      const bbox_share = unpaidShipments.reduce(
        (sum, s) => sum + (s.delivery_fee || 0),
        0,
      );
    
      const settlement = this.settlementsRepo.create({
        tenant_id,
        total_collected,
        tenant_share,
        bbox_share,
        total_due: tenant_share,
        total_delivery_fees: bbox_share,
        total_paid: 0,
        status: 'draft',
        period_start,
        period_end,
      });
    
      const saved = await this.settlementsRepo.save(settlement);
    
      for (const s of unpaidShipments) {
        s.settlement_id = saved.id;
      }
      await this.shipmentsRepo.save(unpaidShipments);
    
      return { settlement_id: saved.id };
    }
    
      
  
    async listSettlements(tenant_id: string) {
      return this.settlementsRepo.find({
        where: { tenant_id },
        order: { created_at: 'DESC' },
      });
    }
  
    async getSettlementDetails(id: string, tenant_id: string) {
      const settlement = await this.settlementsRepo.findOne({
        where: { id, tenant_id },
        relations: ['shipments'],
      });
  
      if (!settlement) throw new NotFoundException('Settlement not found');
  
      return settlement;
    }

    async confirmSettlement(settlement_id: string, confirmed_by: string) {
      const settlement = await this.settlementsRepo.findOne({
        where: { id: settlement_id },
      });
    
      if (!settlement) throw new NotFoundException('Settlement not found');
    
      if (settlement.status !== 'draft') {
        throw new BadRequestException('Only draft settlements can be confirmed');
      }
    
      settlement.status = 'confirmed';
      settlement.confirmed_by = confirmed_by;
      settlement.confirmed_at = new Date();
    
      await this.settlementsRepo.save(settlement);
    
      return { message: 'Settlement confirmed' };
    }
    
  }
  