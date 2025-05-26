import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Building } from '../../buildings/entities/building.entity';
import { ChargeType } from '../enums/charge-type.enum';
import { Apartment } from '../../apartments/entities/apartment.entity';

@Entity('charges')
export class Charge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ChargeType,
    default: ChargeType.SURFACE,
  })
  type: ChargeType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => Building, building => building.charges)
  building: Building;

  @Column()
  buildingId: string;

  @ManyToOne(() => Apartment, apartment => apartment.charges, { nullable: true })
  apartment: Apartment;

  @Column({ nullable: true })
  apartmentId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 