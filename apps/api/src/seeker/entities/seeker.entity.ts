import { Consultation } from 'src/common/enities/consultation.entity';
import { Doc } from 'src/common/enities/document.entity';
import { Review } from 'src/common/enities/review.entity';
import { User } from 'src/common/enities/user.entity';
import { ChildEntity, Column, OneToMany } from 'typeorm';

@ChildEntity()
export class Seeker extends User {
  @Column()
  academicInfo: String;

  @Column()
  country: String;

  @OneToMany(() => Doc, (doc) => doc.seeker)
  docs: Doc[];

  @OneToMany(() => Consultation, (consultation) => consultation.seeker)
  consultations: Consultation[];

  @OneToMany(() => Review, (review) => review.seeker)
  reviews: Review[];
}
