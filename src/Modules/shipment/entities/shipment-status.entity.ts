import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class ShipmentStatus {
  @PrimaryColumn()
  code: string; 

  @Column({ type: 'jsonb', default: {} })
  name_translations: {
    en: string;
    ar: string;
  };

  @Column()
  color: string;

  @Column({ default: true })
  is_active: boolean;

  
  @Column({ type: 'int', default: 0 }) 
  sort: number;
}
