import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Consultation, Status } from 'src/common/enities/consultation.entity';
import { Counselor } from 'src/counselor/entities/counselor.entity';
import { Seeker } from 'src/seeker/entities/seeker.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class ConsultationService {
  constructor(
    @InjectRepository(Counselor)
    private counselorRepo: Repository<Counselor>,

    @InjectRepository(Seeker)
    private seekerRepo: Repository<Seeker>,

    @InjectRepository(Consultation)
    private consRepo: Repository<Consultation>,
  ) {}

  async createRequest(
    seekerId: string,
    counselorId: string,
    fee?: number,
  ): Promise<Consultation> {
    const consultation = this.consRepo.create({
      status: Status.REQUESTED,
      seeker: { id: seekerId } as any,
      counselor: { id: counselorId } as any,
      fee,
    });
    return await this.consRepo.save(consultation);
  }

  async getConsultationsForCounselor(
    counselorId: string,
    status?: Status,
  ): Promise<Consultation[]> {
    const where: any = { counselor: { id: counselorId } };
    if (status) where.status = status;

    return await this.consRepo.find({
      where,
      relations: ['counselor'],
    });
  }

  async getConsultationsForSeeker(
    seekerId: string,
    status?: Status,
  ): Promise<Consultation[]> {
    const where: any = { seeker: { id: seekerId } };
    if (status) where.status = status;

    return await this.consRepo.find({
      where,
      relations: ['seeker'],
    });
  }

  async updateStatus(
    consultationId: string,
    status: Status,
  ): Promise<Consultation> {
    await this.consRepo.update(consultationId, { status });
    return await this.consRepo.findOneOrFail({
      where: { id: consultationId },
      relations: ['seeker', 'counselor'],
    });
  }

  async scheduleAppointment(
    consultationId: string,
    appointmentTime: Date,
    fee: number,
  ): Promise<Consultation> {
    await this.consRepo.update(consultationId, {
      appointmentTime,
      fee,
      status: Status.ACCEPTED,
    });
    return await this.consRepo.findOneOrFail({
      where: { id: consultationId },
      relations: ['seeker', 'counselor'],
    });
  }

  async getConsultationsByStatus(
    counselorId: string,
    statuses: Status | Status[],
  ) {
    const statusArray = Array.isArray(statuses) ? statuses : [statuses];
    return this.consRepo.find({
      where: {
        counselor: { id: counselorId },
        status: In(statusArray),
      },
      relations: ['seeker', 'counselor'],
      order: { appointmentTime: 'ASC' },
    });
  }
}
