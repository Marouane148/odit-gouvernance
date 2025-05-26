import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Building } from '../../buildings/entities/building.entity';

export enum RepartitionKeyType {
  SURFACE = 'SURFACE',
  CONSOMMATION = 'CONSOMMATION',
  ETAGE = 'ETAGE',
  PARKING = 'PARKING',
  CUSTOM = 'CUSTOM',
}

@Entity('repartition_keys')
export class RepartitionKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: RepartitionKeyType,
  })
  type: RepartitionKeyType;

  @Column('numeric', { precision: 10, scale: 2 })
  value: number;

  @ManyToOne(() => Building, building => building.repartitionKeys)
  building: Building;

  @Column()
  buildingId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 