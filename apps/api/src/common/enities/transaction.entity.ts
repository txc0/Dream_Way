import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 2, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 2, scale: 2 })
  serviceFee: number;

  @Column({ type: 'enum', enum: TStatus, default: TStatus.PENDING })
  status: TStatus;

  @Column({ type: 'text' })
  transactionId: string;
}
