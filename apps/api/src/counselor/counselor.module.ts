import { Module } from '@nestjs/common';
import { CounselorService } from './counselor.service';
import { CounselorController } from './counselor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Counselor } from './entities/counselor.entity';
import { Consultation } from 'src/common/enities/consultation.entity';
import { Review } from 'src/common/enities/review.entity';
import { Specialization } from 'src/common/enities/specialization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Counselor, Consultation, Review, Specialization]),
  ],
  controllers: [CounselorController],
  providers: [CounselorService],
})
export class CounselorModule {}
