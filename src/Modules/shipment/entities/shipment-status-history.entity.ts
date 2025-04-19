import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ShipmentStatus } from './shipment-status.entity';

@Entity()
export class ShipmentStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shipment_id: string;

  @Column()
  status_code: string;

  @ManyToOne(() => ShipmentStatus, { eager: true })
  @JoinColumn({ name: 'status_code', referencedColumnName: 'code' })
  status: ShipmentStatus;

  @Column({ nullable: true })
  note?: string;

  @CreateDateColumn()
  created_at: Date;
}
