import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Building } from './building.entity';
import { Expense } from './expense.entity';

@Entity()
export class DistributionKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string; // exemple: 'tantièmes', 'surface', etc.

  @Column('float')
  value: number;

  @ManyToOne(() => Building, building => building.distributionKeys, { eager: true })
  building: Building;

  @OneToMany(() => Expense, expense => expense.distributionKey)
  expenses: Expense[];
}