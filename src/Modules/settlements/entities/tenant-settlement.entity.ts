import { Shipment } from 'src/Modules/shipment/entities/shipment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('tenant_settlements')
export class TenantSettlement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: string;

  @Column({ type: 'decimal', default: 0 })
  total_collected: number;

  @Column({ type: 'decimal', default: 0 })
  tenant_share: number;

  @Column({ type: 'decimal', default: 0 })
  bbox_share: number;

  @Column({ type: 'decimal', default: 0 }) // ✅ لازم تضيفها
  total_due: number;

  @Column({ type: 'decimal', default: 0 }) // ✅ لازم تضيفها
  total_delivery_fees: number;

  @Column({ type: 'decimal', default: 0 }) // ✅ لازم تضيفها
  total_paid: number;

  @Column({ type: 'varchar', default: 'SDG' })
  currency: string;

  @Column()
  period_start: Date;

  @Column()
  period_end: Date;

  @Column({ default: false })
  is_paid: boolean;

  @Column({ type: 'timestamp', nullable: true })
  paid_at?: Date;

  @Column({ type: 'varchar', default: 'draft' })
  status: 'draft' | 'confirmed' | 'paid' | 'pending';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Shipment, (shipment) => shipment.settlement)
  shipments: Shipment[];
  @Column({ nullable: true })
confirmed_by?: string;

@Column({ type: 'timestamp', nullable: true })
confirmed_at?: Date;
}
