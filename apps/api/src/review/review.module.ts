import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Consultation } from 'src/common/enities/consultation.entity';
import { Review } from 'src/common/enities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Consultation])], // inject repos
  providers: [ReviewService],
  controllers: [ReviewController],
  exports: [ReviewService], // optional: if used elsewhere
})
export class ReviewModule {}
