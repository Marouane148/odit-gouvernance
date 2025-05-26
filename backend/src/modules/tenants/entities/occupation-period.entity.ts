import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Apartment } from '../../apartments/entities/apartment.entity';
import { Tenant } from './tenant.entity';

@Entity('occupation_periods')
export class OccupationPeriod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @ManyToOne(() => Apartment, apartment => apartment.occupationPeriods)
  apartment: Apartment;

  @Column()
  apartmentId: string;

  @ManyToOne(() => Tenant, tenant => tenant.occupationPeriods)
  tenant: Tenant;

  @Column()
  tenantId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 