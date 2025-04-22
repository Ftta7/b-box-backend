import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('global_users')
export class GlobalUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string | null; // اختياري

  @Column({ type: 'varchar', nullable: true })
  name: string | null; // الاسم العام (للسائقين أو التّجار)

  @Column({ type: 'varchar', unique: true, nullable: true })
  phone: string | null; // أساسي للسائقين

  @Column({ type: 'varchar' })
  password_hash: string;

  @Column({ type: 'varchar', default: 'customer' })
  role: 'admin' | 'driver' | 'tenant' | 'customer';

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
