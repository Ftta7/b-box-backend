import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tenant_users')
export class TenantUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: string;

  @Column()
  user_id: string;

  @Column()
  role: string;

  @Column({ default: true })
  is_active: boolean;
}
