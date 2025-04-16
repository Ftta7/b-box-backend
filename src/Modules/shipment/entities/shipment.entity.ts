import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from 'src/Modules/tenant/tenant.entity';
import { ShipmentType } from './shipment-type.entity';
import { Driver } from 'src/Modules/driver/entities/driver.entity';
import { TenantSettlement } from 'src/Modules/settlements/entities/tenant-settlement.entity';

@Entity('shipments')
export class Shipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ nullable: true })
  driver_id?: string;

  @ManyToOne(() => Driver, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver?: Driver;

  @Column({ type: 'varchar', default: 'pending' })
  status: 'pending' | 'assigned' | 'in_progress' | 'delivered' | 'cancelled';

  @Column({ type: 'jsonb', nullable: false, default: {} })
  to_address: {
    street: string;
    city: string;
    neighborhood?: string;
  };

  @Column({ type: 'jsonb', nullable: false, default: {} })
  recipient_info: {
    name: string;
    phone: string;
    notes?: string;
  };

  @Column()
  type_code: string;

  @ManyToOne(() => ShipmentType)
  @JoinColumn({ name: 'type_code', referencedColumnName: 'code' })
  type: ShipmentType;

  @Column({ type: 'decimal', default: 0 })
  delivery_fee: number;

  @Column({ type: 'varchar', default: 'cod' })
  payment_method: 'cod' | 'prepaid';

  @Column({ nullable: true })
  settlement_id?: string;

  @ManyToOne(() => TenantSettlement, (s) => s.shipments, { nullable: true })
  @JoinColumn({ name: 'settlement_id' })
  settlement?: TenantSettlement;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  delivered_at?: Date;
}
