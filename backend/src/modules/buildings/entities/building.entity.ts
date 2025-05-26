import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Apartment } from '../../apartments/entities/apartment.entity';
import { Charge } from '../../charges/entities/charge.entity';
import { Expense } from '../../expenses/entities/expense.entity';
import { RepartitionKey } from '../../repartition-keys/entities/repartition-key.entity';
import { DistributionKey } from '../../distribution-keys/entities/distribution-key.entity';

@Entity('buildings')
export class Building {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalSurface: number;

  @Column()
  numberOfApartments: number;

  @Column({ type: 'date' })
  managementStartDate: Date;

  @Column({ type: 'date', nullable: true })
  managementEndDate: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Apartment, apartment => apartment.building)
  apartments: Apartment[];

  @OneToMany(() => Charge, charge => charge.building)
  charges: Charge[];

  @OneToMany(() => Expense, expense => expense.building)
  expenses: Expense[];

  @OneToMany(() => RepartitionKey, repartitionKey => repartitionKey.building)
  repartitionKeys: RepartitionKey[];

  @OneToMany(() => DistributionKey, distributionKey => distributionKey.building)
  distributionKeys: DistributionKey[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 