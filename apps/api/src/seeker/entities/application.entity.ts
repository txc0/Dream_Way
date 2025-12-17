// src/seeker/entities/application.entity.ts
import {
  Entity, PrimaryGeneratedColumn, ManyToOne, Column,
  CreateDateColumn, UpdateDateColumn, Unique, Index
} from 'typeorm';
import { Seeker } from './seeker.entity';
import { Program } from 'src/common/enities/programs.entity';

export enum AppStatus {
  RESEARCHING = 'RESEARCHING',
  SUBMITTED   = 'SUBMITTED',
  UNDER_REVIEW= 'UNDER_REVIEW',
  OFFER       = 'OFFER',
  REJECTED    = 'REJECTED',
  WITHDRAWN   = 'WITHDRAWN',
  VISA        = 'VISA',
  ENROLLED    = 'ENROLLED',
}

@Entity()
@Unique(['seeker', 'program']) // 1 application per program per seeker
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Seeker, { onDelete: 'CASCADE' })
  @Index()
  seeker: Seeker;

  @ManyToOne(() => Program, { onDelete: 'CASCADE', eager: true })
  program: Program;

  @Column({ type: 'enum', enum: AppStatus, default: AppStatus.RESEARCHING })
  status: AppStatus;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
