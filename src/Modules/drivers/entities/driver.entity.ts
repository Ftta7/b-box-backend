import { GlobalUser } from 'src/Modules/users/entities/global-user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: string; // التيننت الذي ينتمي له السائق

  @OneToOne(() => GlobalUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: GlobalUser;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @Column({ type: 'boolean', default: false })
  is_bbox_driver: boolean;

  @Column({ type: 'varchar', default: 'salary' })
  payment_type: 'salary' | 'commission';

  @Column({ type: 'decimal', default: 0 })
  commission_rate: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
