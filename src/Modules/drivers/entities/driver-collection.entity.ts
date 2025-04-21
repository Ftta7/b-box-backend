import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Driver } from 'src/Modules/drivers/entities/driver.entity';
  import { Shipment } from 'src/Modules/shipment/entities/shipment.entity';
  
  @Entity('driver_collections')
  export class DriverCollection {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    driver_id: string;
  
    @ManyToOne(() => Driver)
    @JoinColumn({ name: 'driver_id' })
    driver: Driver;
  
    @Column()
    shipment_id: string;
  
    @ManyToOne(() => Shipment)
    @JoinColumn({ name: 'shipment_id' })
    shipment: Shipment;
  
    @Column({ type: 'decimal' })
    amount: number;
  
    @Column({ type: 'varchar' })
    payment_type: 'cash' | 'bank_transfer';
  
    @CreateDateColumn()
    collected_at: Date;
  
    @Column({ default: false })
    confirmed_by_admin: boolean;
  }
  