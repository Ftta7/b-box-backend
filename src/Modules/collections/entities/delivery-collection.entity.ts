import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('delivery_collections')
export class DeliveryCollection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shipment_id: string;

  @Column()
  driver_id: string;

  @Column({ type: 'decimal' })
  amount_collected: number;

  @Column({ type: 'boolean', default: false })
  is_settled: boolean;

  @CreateDateColumn()
  collected_at: Date;
}
