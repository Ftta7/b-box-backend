// src/modules/shipments/entities/shipment-status-history.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class ShipmentStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shipment_id: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  note?: string;

  @CreateDateColumn()
  created_at: Date;
}
