import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('regularization_history')
export class RegularizationHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  date: Date;

  @Column({ nullable: true })
  userId: string;

  @Column()
  action: string;

  @Column('jsonb', { nullable: true })
  details: any;

  @Column({ nullable: true })
  result: string;
}