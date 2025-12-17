import { Counselor } from 'src/counselor/entities/counselor.entity';
import { Seeker } from 'src/seeker/entities/seeker.entity';
import {
  Collection,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @ManyToOne(() => Seeker, (seeker) => seeker.reviews)
  seeker: Seeker;

  @ManyToOne(() => Counselor, (counselor) => counselor.reviews)
  counselor: Counselor;
}
