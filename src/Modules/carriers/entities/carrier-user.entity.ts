import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Carrier } from './carrier.entity';

export enum CarrierUserRole {
  MANAGER = 'manager',
  DRIVER = 'driver',
}

@Entity('carrier_users')
export class CarrierUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Carrier, (carrier) => carrier.users)
  @JoinColumn({ name: 'carrier_id' })
  carrier: Carrier;

  @Column({ type: 'uuid' })
  global_user_id: string;

  @Column({ type: 'enum', enum: CarrierUserRole })
  role: CarrierUserRole;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
