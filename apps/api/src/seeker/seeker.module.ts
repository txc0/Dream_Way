import { Module } from '@nestjs/common';
import { SeekerService } from './seeker.service';
import { SeekerController } from './seeker.controller';
import { Seeker } from './entities/seeker.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doc } from 'src/common/enities/document.entity';
import { Consultation } from 'src/common/enities/consultation.entity';
import { Review } from 'src/common/enities/review.entity';
import { Program } from 'src/common/enities/programs.entity';
import { Application } from './entities/application.entity';
import { Notice } from 'src/common/enities/notice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Seeker, Doc, Consultation, Review,Program,Application,Notice])],
  controllers: [SeekerController],
  providers: [SeekerService],
})
export class SeekerModule {}
