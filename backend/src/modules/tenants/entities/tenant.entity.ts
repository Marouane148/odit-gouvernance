import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Apartment } from '../../apartments/entities/apartment.entity';
import { OccupationPeriod } from './occupation-period.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @OneToMany(() => Apartment, apartment => apartment.tenant)
  apartments: Apartment[];

  @OneToMany(() => OccupationPeriod, period => period.tenant)
  occupationPeriods: OccupationPeriod[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 