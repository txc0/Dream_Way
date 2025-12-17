import { Counselor } from 'src/counselor/entities/counselor.entity';
import { Seeker } from 'src/seeker/entities/seeker.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum Status {
  REQUESTED = 'requested',
  ACCEPTED = 'accepted',
  PAID = 'paid',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

@Entity()
export class Consultation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Status, default: Status.REQUESTED })
  status: Status;

  @Column({ nullable: true })
  appointmentTime: Date;

  @Column({ type: 'float', nullable: true })
  fee: number;

  @ManyToOne(() => Seeker, (seeker) => seeker.consultations)
  seeker: Seeker;

  @ManyToOne(() => Counselor, (counselor) => counselor.consultations)
  counselor: Counselor;
}
