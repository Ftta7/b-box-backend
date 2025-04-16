import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: string; // التيننت الذي ينتمي له السائق

  @Column()
  full_name: string;

  @Column({ unique: true })
  phone: string;

  @Column({ type: 'boolean', default: false })
  is_bbox_driver: boolean; // true = سائق من فريق BBox

  @Column({ type: 'varchar', default: 'salary' })
  payment_type: 'salary' | 'commission'; // نوع الدفع

  @Column({ type: 'decimal', nullable: true })
  commission_rate?: number; // فقط إذا كان payment_type = 'commission'

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
