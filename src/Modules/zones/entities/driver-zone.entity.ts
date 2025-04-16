import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('driver_zones')
export class DriverZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  driver_id: string;

  @Column()
  neighborhood_id: string;
}
