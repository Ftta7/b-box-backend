import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class ShipmentStatus {
  @PrimaryColumn()
  code: string; // مثل: 'pending', 'assigned', 'delivered', ...

  @Column({ type: 'jsonb', default: {} })
  name_translations: {
    en: string;
    ar: string;
  };

  @Column()
  color: string;

  @Column({ default: true })
  is_active: boolean;
}
