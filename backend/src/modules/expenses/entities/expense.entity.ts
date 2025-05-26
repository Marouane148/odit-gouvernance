import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Building } from '../../buildings/entities/building.entity';

export enum ExpenseType {
  EAU = 'EAU',
  ELECTRICITE = 'ELECTRICITE',
  GAZ = 'GAZ',
  CHAUFFAGE = 'CHAUFFAGE',
  ASCENSEUR = 'ASCENSEUR',
  ENTRETIEN = 'ENTRETIEN',
  ASSURANCE = 'ASSURANCE',
  AUTRE = 'AUTRE',
}

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ExpenseType,
  })
  type: ExpenseType;

  @Column('numeric', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  invoiceNumber: string;

  @Column({ nullable: true })
  invoiceFile: string;

  @ManyToOne(() => Building, building => building.expenses)
  building: Building;

  @Column()
  buildingId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 