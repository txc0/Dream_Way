import { Counselor } from 'src/counselor/entities/counselor.entity';
import {
  Collection,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Specialization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ManyToMany(() => Counselor, (counselor) => counselor.specializations)
  counselors: Counselor[];
}
