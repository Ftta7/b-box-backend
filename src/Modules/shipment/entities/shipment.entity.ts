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
import { ShipmentStatus } from './shipment-status.entity';
import { Carrier } from 'src/Modules/carriers/entities/carrier.entity';
@Entity('shipments')
export class Shipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id?: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;

  @Column({ nullable: true })
  driver_id?: string;

  @ManyToOne(() => Driver, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver?: Driver;

  @Column({ type: 'uuid', nullable: true })
  carrier_id?: string;

  @ManyToOne(() => Carrier, { nullable: true })
  @JoinColumn({ name: 'carrier_id' })
  carrier?: Carrier;

  @Column({ type: 'decimal', default: 0 })
  delivery_fee: number;

  @Column({ type: 'decimal', default: 0 })
  platform_fee: number;

  @Column({ type: 'decimal', default: 0 })
  tenant_payout: number;

  @Column({ type: 'decimal', nullable: true })
  cod_amount?: number;

  @Column({ type: 'decimal', nullable: true })
  amount_received_from_carrier?: number;

  @Column({ default: false })
  is_received_from_carrier: boolean;

  @Column({ default: false })
  is_settled_with_tenant: boolean;


  @Column({ type: 'jsonb', nullable: false, default: {} })
  from_address: {
    street: string;
    city: string;
    neighborhood?: string;
    lat: number;
    lng: number;
  };

  @Column({ type: 'jsonb', nullable: false, default: {} })
  to_address: {
    street: string;
    city: string;
    neighborhood?: string;
    lat: number;
    lng: number;
  };

  @Column({ type: 'jsonb', nullable: false, default: {} })
  recipient_info: {
    name: string;
    phone: string;
    notes?: string;
  };

  @Column({ type: 'decimal', nullable: true })
  shipment_value: number;

  @Column({ type: 'decimal', default: 0 })
  total_amount: number;

  @Column({ type: 'varchar', nullable: true })
  actual_payment_type: 'cash' | 'bank_transfer' | 'online' | 'not_paid';

  @Column({ type: 'varchar', default: 'pending' })
  payment_status: 'pending' | 'paid' | 'partial' | 'failed' | 'refunded';

  @Column({ nullable: true })
  settlement_id?: string;

  @ManyToOne(() => TenantSettlement, (s) => s.shipments, { nullable: true })
  @JoinColumn({ name: 'settlement_id' })
  settlement?: TenantSettlement;

  @Column({ name:'sender_location_id', type: 'varchar', nullable: true })
  sender_location_id?: string;

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

  @Column({ default: false })
  is_wallet_deducted: boolean;

  @ManyToOne(() => ShipmentType)
  @JoinColumn({ name: 'type_code', referencedColumnName: 'id' })
  type: ShipmentType;

  @Column({ name: 'status_code' })
  status_code: string;

  @ManyToOne(() => ShipmentStatus, { eager: true })
  @JoinColumn({ name: 'status_code', referencedColumnName: 'code' })
  status: ShipmentStatus;
}
