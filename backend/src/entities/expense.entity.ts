import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Building } from './building.entity';
import { DistributionKey } from './distribution-key.entity';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  type: string;

  @ManyToOne(() => Building, building => building.id)
  building: Building;

  @ManyToOne(() => DistributionKey, distributionKey => distributionKey.expenses, { nullable: true })
  distributionKey: DistributionKey;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}