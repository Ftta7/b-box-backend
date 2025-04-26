import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Carrier } from './carrier.entity';

@Entity('carrier_cities')
export class CarrierCity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Carrier, (carrier) => carrier.cities)
  @JoinColumn({ name: 'carrier_id' })
  carrier: Carrier;

  @Column({ type: 'uuid' })
  city_id: string;

  @Column({ type: 'int', default: 2 })
  eta_days: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
