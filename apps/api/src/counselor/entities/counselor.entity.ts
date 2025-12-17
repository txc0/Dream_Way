import { Consultation } from 'src/common/enities/consultation.entity';
import { Review } from 'src/common/enities/review.entity';
import { Specialization } from 'src/common/enities/specialization.entity';
import { User } from 'src/common/enities/user.entity';
import { ChildEntity, Column, ManyToMany, OneToMany } from 'typeorm';

@ChildEntity('counselor')
export class Counselor extends User {
  @Column({ type: 'boolean', default: false })
  isApproved: boolean;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @OneToMany(() => Consultation, (consultation) => consultation.counselor)
  consultations: Consultation[];

  @OneToMany(() => Review, (review) => review.counselor)
  reviews: Review[];

  @ManyToMany(
    () => Specialization,
    (specialization) => specialization.counselors,
  )
  specializations: Specialization[];
}
