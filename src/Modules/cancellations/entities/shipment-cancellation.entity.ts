import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('shipment_cancellations')
export class ShipmentCancellation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shipment_id: string;

  @Column()
  cancelled_by: 'tenant' | 'driver' | 'system' | 'admin';

  @Column({ nullable: true })
  reason?: string;

  @CreateDateColumn()
  created_at: Date;
}
