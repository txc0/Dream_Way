import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultationService } from './consultation.service';
import { ConsultationController } from './consultation.controller';
import { Consultation } from 'src/common/enities/consultation.entity';
import { Seeker } from 'src/seeker/entities/seeker.entity';
import { Counselor } from 'src/counselor/entities/counselor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Consultation, Seeker, Counselor])],
  providers: [ConsultationService],
  controllers: [ConsultationController],
})
export class ConsultationModule {}
