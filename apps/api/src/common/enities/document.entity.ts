import { Seeker } from 'src/seeker/entities/seeker.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Doc {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  fileName: string;

  @Column({ type: 'text' })
  filePath: string;

  @Column()
  updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  encrypted: boolean;

  @ManyToOne(() => Seeker, (seeker) => seeker.docs)
  seeker: Seeker;
}
