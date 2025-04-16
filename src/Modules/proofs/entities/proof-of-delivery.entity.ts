import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('proofs_of_delivery')
export class ProofOfDelivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shipment_id: string;

  @Column({ type: 'varchar', nullable: true })
  image_url?: string;

  @Column({ type: 'varchar', nullable: true })
  sms_code?: string;

  @Column({ type: 'jsonb', nullable: true })
  location?: { lat: number; lng: number };

  @CreateDateColumn()
  created_at: Date;
}
