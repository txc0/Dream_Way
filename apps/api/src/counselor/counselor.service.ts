import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCounselorDto } from './dto/create-counselor.dto';
import { UpdateCounselorDto } from './dto/update-counselor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Counselor } from './entities/counselor.entity';
import { privateDecrypt } from 'crypto';
import { Repository } from 'typeorm';
import { Review } from 'src/common/enities/review.entity';
import { Consultation, Status } from 'src/common/enities/consultation.entity';

@Injectable()
export class CounselorService {
  consultationRepo: any;
  constructor(
    @InjectRepository(Counselor)
    private counselorRepo: Repository<Counselor>,

    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
  ) {}

  async getVerifiedCounselors(): Promise<Counselor[]> {
    return await this.counselorRepo.find({ where: { isVerified: true } });
  }

  async findCounselorsBySpecialization(
    specializationId: string,
  ): Promise<Counselor[]> {
    return await this.counselorRepo.find({
      relations: ['specializations'],
      where: { specializations: { id: specializationId } },
    });
  }

  async getReviews(counselorId: string): Promise<Review[]> {
    return await this.reviewRepo.find({
      relations: ['counselor'],
      where: { counselor: { id: counselorId } },
    });
  }
  async getConsultationsByStatus(
    seekerId: string,
    status: Status,
  ): Promise<Consultation[]> {
    return await this.consultationRepo.find({
      relations: ['counselor'],
      where: {
        seeker: { id: seekerId },
        status,
      },
    });
  }

  async getProfile(counselorId: string): Promise<Partial<Counselor>> {
    const counselor = await this.counselorRepo.findOne({
      where: { id: counselorId },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'bio',
        'isApproved',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!counselor) throw new NotFoundException('Counselor not found');
    return counselor;
  }

  async updateProfile(
    counselorId: string,
    data: Partial<Counselor>,
  ): Promise<Partial<Counselor>> {
    await this.counselorRepo.update(counselorId, data);
    return this.getProfile(counselorId);
  }
}
