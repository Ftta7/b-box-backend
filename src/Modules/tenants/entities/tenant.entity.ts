import { ShipmentType } from 'src/Modules/shipment/entities/shipment-type.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('tenants')
export class Tenant {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  subdomain: string;

  @Column({ type: 'jsonb', default: { en: '', ar: '' } })
  name_translations: Record<string, string>;

  @Column({ type: 'jsonb', nullable: true })
  theme_config?: any;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  created_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  updated_at?: Date;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'varchar', nullable: false })
  api_key?: string;

  @ManyToOne(() => ShipmentType, { nullable: true })
  shipment_type: ShipmentType;

  @Column({ nullable: true })
  shipment_type_id: string;

  @Column({ type: 'enum', enum: ['self', 'bbox', 'hybrid'], default: 'self' })
  delivery_mode: 'self' | 'bbox' | 'hybrid';

}
