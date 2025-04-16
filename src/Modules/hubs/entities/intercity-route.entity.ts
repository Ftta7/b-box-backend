import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('intercity_routes')
export class IntercityRoute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  from_city: string;

  @Column()
  to_city: string;

  @Column()
  via_hub_id: string;

  @Column({ type: 'integer' })
  estimated_time_minutes: number;
}
