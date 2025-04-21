import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
  } from 'typeorm';
  import { Driver } from 'src/Modules/drivers/entities/driver.entity';
  import { DriverCollection } from './driver-collection.entity';
  
  @Entity('driver_settlements')
  export class DriverSettlement {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    driver_id: string;
  
    @ManyToOne(() => Driver)
    @JoinColumn({ name: 'driver_id' })
    driver: Driver;
  
    @Column({ type: 'decimal', default: 0 })
    total_collected: number;
  
    @Column({ type: 'varchar', default: 'pending' })
    status: 'pending' | 'confirmed' | 'paid';
  
    @Column({ nullable: true })
    confirmed_by?: string; // ID of admin user who confirmed
  
    @Column({ type: 'timestamp', nullable: true })
    confirmed_at?: Date;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  
    // لو ح نربطها لاحقًا بـ DriverCollection entries
    @OneToMany(() => DriverCollection, (dc) => dc.shipment_id)
    collections?: DriverCollection[];
  }
  