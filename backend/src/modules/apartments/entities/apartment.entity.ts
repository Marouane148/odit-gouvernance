import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Building } from '../../buildings/entities/building.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { OccupationPeriod } from '../../tenants/entities/occupation-period.entity';
import { Charge } from '../../charges/entities/charge.entity';

export enum ApartmentType {
  APARTMENT = 'APARTMENT',
  PARKING = 'PARKING',
  COMMERCE = 'COMMERCE',
  CELLAR = 'CELLAR',
}

@Entity('apartments')
export class Apartment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: string;

  @Column('decimal', { precision: 10, scale: 2 })
  surface: number;

  @Column()
  floor: number;

  @Column({
    type: 'enum',
    enum: ApartmentType,
    default: ApartmentType.APARTMENT,
  })
  type: ApartmentType;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  provision: number;

  @Column({ default: false })
  isOccupied: boolean;

  @ManyToOne(() => Building, building => building.apartments)
  building: Building;

  @Column()
  buildingId: string;

  @ManyToOne(() => Tenant, tenant => tenant.apartments)
  tenant: Tenant;

  @OneToMany(() => OccupationPeriod, period => period.apartment)
  occupationPeriods: OccupationPeriod[];

  @OneToMany(() => Charge, charge => charge.apartment)
  charges: Charge[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}