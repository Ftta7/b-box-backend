import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from 'src/Modules/tenants/entities/tenant.entity';
import { ShipmentType } from './shipment-type.entity';
import { Driver } from 'src/Modules/drivers/entities/driver.entity';
import { TenantSettlement } from 'src/Modules/settlements/entities/tenant-settlement.entity';
import { TenantLocation } from 'src/Modules/tenants/entities/tenant-location.entity';

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


  @Column({ type: 'decimal', default: 0 })
  delivery_fee: number;

  @Column({ type: 'varchar', default: 'cod' })
  payment_method: 'cod' | 'prepaid';

  @Column({ nullable: true })
  settlement_id?: string;

  @ManyToOne(() => TenantSettlement, (s) => s.shipments, { nullable: true })
  @JoinColumn({ name: 'settlement_id' })
  settlement?: TenantSettlement;

  @Column()
  sender_location_id: string;
  
  @ManyToOne(() => TenantLocation)
  @JoinColumn({ name: 'sender_location_id' })
  sender_location: TenantLocation;

  @Column({ type: 'jsonb', nullable: true })
  items?: {
    name: string;
    quantity: number;
    sku?: string;
  }[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  delivered_at?: Date;

  @Column({ unique: true })
tracking_number: string;


@Column()
type_code: string;

@ManyToOne(() => ShipmentType)
@JoinColumn({ name: 'type_code', referencedColumnName: 'id' }) // أو 'code' حسب عمود الربط
type: ShipmentType;

}
