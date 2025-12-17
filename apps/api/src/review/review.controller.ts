import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ReviewService } from './review.service';
import { SubmitReviewDto } from 'src/common/dtos/submit-review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':consultationId')
  async submitReview(
    @Param('consultationId') consultationId: string,
    @Body() dto: SubmitReviewDto,
  ) {
    return this.reviewService.submitReview(
      consultationId,
      dto.rating,
      dto.comment,
    );
  }

  @Get('counselor/:id')
  async getReviewsForCounselor(@Param('id') counselorId: string) {
    return this.reviewService.getReviewsForCounselor(counselorId);
  }
}
