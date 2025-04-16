import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('neighborhoods')
export class Neighborhood {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column({ type: 'jsonb', nullable: true })
  geo_bounds?: any;
}
