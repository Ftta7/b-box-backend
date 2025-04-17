import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Shipment } from './shipment.entity';

@Entity('shipment_types')
export class ShipmentType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  name: string;

  @OneToMany(() => Shipment, shipment => shipment.type)
  shipments: Shipment[];
}
