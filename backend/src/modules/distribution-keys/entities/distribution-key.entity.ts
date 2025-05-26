import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Building } from '../../buildings/entities/building.entity';

export enum DistributionKeyType {
  SURFACE = 'SURFACE',
  FIXED = 'FIXED',
  CUSTOM = 'CUSTOM',
}

@Entity('distribution_keys')
export class DistributionKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: DistributionKeyType,
    default: DistributionKeyType.SURFACE,
  })
  type: DistributionKeyType;

  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Building, building => building.distributionKeys)
  building: Building;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 