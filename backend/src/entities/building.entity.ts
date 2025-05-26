import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { DistributionKey } from './distribution-key.entity';
import { Apartment } from '../modules/apartments/entities/apartment.entity';
import { Charge } from '../modules/charges/entities/charge.entity';

@Entity('buildings')
export class Building {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ type: 'date' })
  managementStartDate: Date;

  @Column({ type: 'date', nullable: true })
  managementEndDate: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => DistributionKey, distributionKey => distributionKey.building)
  distributionKeys: DistributionKey[];

  @OneToMany(() => Apartment, apartment => apartment.building)
  apartments: Apartment[];

  @OneToMany(() => Charge, charge => charge.building)
  charges: Charge[];
}