import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
  } from 'typeorm';
  import { Carrier } from './carrier.entity';
  
  export enum WalletTransactionType {
    PLATFORM_FEE = 'platform_fee',
    TOPUP = 'topup',
    ADJUSTMENT = 'adjustment'
  }
  
  @Entity('wallet_transactions')
  export class WalletTransaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Carrier, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'carrier_id' })
    carrier: Carrier;
  
    @Column({ type: 'uuid' })
    carrier_id: string;
  
    @Column({ type: 'decimal' })
    amount: number;
  
    @Column({ type: 'enum', enum: WalletTransactionType })
    type: WalletTransactionType;
  
    @Column({ nullable: true })
    reference?: string;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  