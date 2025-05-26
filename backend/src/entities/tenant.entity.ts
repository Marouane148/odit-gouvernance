import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Apartment } from '../modules/apartments/entities/apartment.entity';

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

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ default: true })
  isCurrent: boolean;

  @Column({ nullable: true })
  emergencyContact?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ nullable: true })
  guarantorName?: string;

  @Column({ nullable: true })
  guarantorPhone?: string;

  @Column({ nullable: true })
  guarantorEmail?: string;

  @ManyToOne(() => Apartment, apartment => apartment.tenant)
  apartment: Apartment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}