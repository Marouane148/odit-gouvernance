import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Building } from './building.entity';

@Entity('repartition_keys')
export class RepartitionKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column('decimal', { precision: 5, scale: 2 })
  value: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Building, building => building.id)
  building: Building;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}