import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('hubs')
export class Hub {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column({ type: 'jsonb', nullable: true })
  location?: { lat: number; lng: number };
}
