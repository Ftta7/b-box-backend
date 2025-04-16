import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shipment_types')
export class ShipmentType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; // مثال: 'standard', 'food', 'documents'

  @Column({ type: 'jsonb', default: { en: '', ar: '' } })
  name_translations: {
    en: string;
    ar: string;
  };

  @Column({ default: true })
  is_active: boolean;
}
