import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Entity('tenant_locations')
export class TenantLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // مثال: "الفرع الرئيسي" أو "مخزن جدة"

  @Column()
  address: string;

  @Column('decimal', { nullable: true })
  latitude: number;

  @Column('decimal', { nullable: true })
  longitude: number;

  @Column()
  tenant_id: string;

  @ManyToOne(() => Tenant)
  tenant: Tenant;

  @CreateDateColumn()
  created_at: Date;
}
