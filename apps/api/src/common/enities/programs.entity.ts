import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum DegreeLevel {
  BACHELORS = 'BACHELORS',
  MASTERS = 'MASTERS',
  DIPLOMA = 'DIPLOMA',
  PHD = 'PHD',
}

@Entity()
export class Program {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() title: string;
  @Column() university: string;
  @Column() country: string;

  @Column({ type: 'enum', enum: DegreeLevel })
  degreeLevel: DegreeLevel;

  @Column({ type: 'int' })
  tuition: number;

  // Postgres array
  @Column('text', { array: true, nullable: true })
  intakeMonths: string[];

  // Free-form requirements (IELTS, CGPA, GRE...)
  @Column({ type: 'jsonb', nullable: true })
  requirements: any;

  @Column({ type: 'date', nullable: true })
  deadline: Date | null;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
