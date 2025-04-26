import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CarrierCity } from './carrier-city.entity';
import { CarrierUser } from './carrier-user.entity';
import { WalletTransaction } from './carrier-wallet-transaction.entity';


export enum CarrierType {
  PLATFORM_MANAGED = 'platform_managed',
  INTEGRATED = 'integrated',
}

@Entity('carriers')
export class Carrier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: CarrierType })
  type: CarrierType;

  @Column({ nullable: true })
  logo_url?: string;

  @Column({ type: 'jsonb', nullable: true })
  contact_info?: Record<string, any>;

  @Column({ type: 'uuid', nullable: true })
  created_by_tenant_id?: string;

  @Column({ default: false })
  is_guaranteed_payout: boolean;

  @Column({ type: 'int', default: 72 })
  payout_duration_in_hours: number;


  @Column({ type: 'decimal', default: 0 })
  wallet_balance: number;

  @Column({ type: 'decimal', default: 0 })
  credit_limit: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => CarrierCity, (carrierCity) => carrierCity.carrier)
  cities: CarrierCity[];

  @OneToMany(() => CarrierUser, (carrierUser) => carrierUser.carrier)
  users: CarrierUser[];

  @OneToMany(() => WalletTransaction, (walletTransaction) => walletTransaction.carrier)
  wallet_transactions: WalletTransaction[];

}
