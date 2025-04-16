import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('dispatch_rules')
export class DispatchRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: string;

  @Column({ type: 'jsonb' })
  conditions: any;

  @Column({ type: 'varchar', default: 'round_robin' })
  strategy: string;
}
