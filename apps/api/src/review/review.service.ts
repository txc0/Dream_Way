import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Consultation } from 'src/common/enities/consultation.entity';
import { Review } from 'src/common/enities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Consultation)
    private readonly consultationRepo: Repository<Consultation>,
  ) {}

  async submitReview(
    consultationId: string,
    rating: number,
    comment?: string,
  ): Promise<Review> {
    // Find consultation
    const consultation = await this.consultationRepo.findOne({
      where: { id: consultationId },
      relations: ['seeker', 'counselor'],
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    const review = this.reviewRepo.create({
      rating,
      seeker: consultation.seeker,
      counselor: consultation.counselor,
      // optional: you can store comment in another column if needed
    });
    if (comment) {
      review.comment = comment;
    }

    return await this.reviewRepo.save(review);
  }

  async getReviewsForCounselor(counselorId: string): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { counselor: { id: counselorId } },
      relations: ['seeker'], // optional: include seeker info if you want
      order: { id: 'DESC' }, // latest reviews first
    });
  }
}
