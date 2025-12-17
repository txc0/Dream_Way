import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Consultation, Status } from 'src/common/enities/consultation.entity';
import { Doc } from 'src/common/enities/document.entity';
import { Review } from 'src/common/enities/review.entity';
import { Repository } from 'typeorm';
import { Seeker } from './entities/seeker.entity';
import { Program } from 'src/common/enities/programs.entity';
import { QueryProgramsDto } from 'src/common/dtos/query-program.dto';
import { CreateProgramDto } from 'src/common/dtos/create-program.dto';
import { UpdateProgramDto } from 'src/common/dtos/update-program.dto';
import { QueryApplicationsDto } from './dto/query-application.dto';
import { Application, AppStatus } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application.dto';
import { UpdateNoticeDto } from 'src/admin/dto/update-notice.dto';
import { Notice } from 'src/common/enities/notice.entity';



@Injectable()
export class SeekerService {
  constructor(
    @InjectRepository(Consultation)
    private readonly consultationRepo: Repository<Consultation>,

    @InjectRepository(Seeker)
    private readonly seekerRepo: Repository<Seeker>,

    @InjectRepository(Doc)
    private readonly docRepo: Repository<Doc>,

    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,

    @InjectRepository(Program) 
    private readonly programRepo: Repository<Program>,

    
    @InjectRepository(Notice) 
    private readonly noticeRepo: Repository<Notice>,

    @InjectRepository(Application)
    private readonly appRepo: Repository<Application>,
  ) {}

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

  async getDocs(seekerId: string): Promise<Doc[]> {
    return await this.docRepo.find({
      where: { seeker: { id: seekerId } },
    });
  }

  async uploadDoc(
    seekerId: string,
    fileName: string,
    filePath: string,
    encrypted = true,
  ): Promise<Doc> {
    const doc = this.docRepo.create({
      fileName,
      filePath,
      updatedAt: new Date(),
      encrypted,
      seeker: { id: seekerId } as any,
    });
    return await this.docRepo.save(doc);
  }

  async getReviews(seekerId: string): Promise<Review[]> {
    return await this.reviewRepo.find({
      relations: ['counselor'],
      where: { seeker: { id: seekerId } },
    });
  }

  async getProfile(seekerId: string): Promise<Partial<Seeker>> {
    const seeker = await this.seekerRepo.findOne({
      where: { id: seekerId },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'academicInfo',
        'country',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!seeker) throw new NotFoundException('Seeker not found');
    return seeker;
  }

  async updateProfile(
    seekerId: string,
    data: Partial<Seeker>,
  ): Promise<Partial<Seeker>> {
    await this.seekerRepo.update(seekerId, data);
    return this.getProfile(seekerId);
  }

    async listPrograms(q: QueryProgramsDto): Promise<Program[]> {
    const qb = this.programRepo.createQueryBuilder('p');
    if (q.q) qb.andWhere('(LOWER(p.title) LIKE :q OR LOWER(p.university) LIKE :q)', { q: `%${q.q.toLowerCase()}%` });
    if (q.country) qb.andWhere('LOWER(p.country) = :country', { country: q.country.toLowerCase() });
    if (q.degreeLevel) qb.andWhere('p.degreeLevel = :dl', { dl: q.degreeLevel });
    if (q.minTuition != null) qb.andWhere('p.tuition >= :min', { min: q.minTuition });
    if (q.maxTuition != null) qb.andWhere('p.tuition <= :max', { max: q.maxTuition });
    if (q.intakeMonth) qb.andWhere(':m = ANY(p.intakeMonths)', { m: q.intakeMonth });
    return qb.orderBy('p.updatedAt', 'DESC').getMany();
  }

    async getProgram(id: string): Promise<Program> {
    const p = await this.programRepo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Program not found');
    return p;
  }

    async createProgram(_seekerId: string, dto: CreateProgramDto): Promise<Program> {
    const entity = this.programRepo.create({
      ...dto,
      deadline: dto.deadline ? new Date(dto.deadline) : null,
    });
    return this.programRepo.save(entity);
  }

    async updateProgram(_seekerId: string, id: string, dto: UpdateProgramDto): Promise<Program> {
    await this.getProgram(id);
    const payload: any = { ...dto };
    if (dto.deadline !== undefined) payload.deadline = dto.deadline ? new Date(dto.deadline) : null;
    await this.programRepo.update(id, payload);
    return this.getProgram(id);
  }

    async deleteProgram(_seekerId: string, id: string): Promise<{ ok: true }> {
    await this.getProgram(id);
    await this.programRepo.delete(id);
    return { ok: true };
  }

  async listApplications(seekerId: string, q: QueryApplicationsDto) {
  const where: any = { seeker: { id: seekerId } };
  if (q?.status) where.status = q.status;
  return this.appRepo.find({ where, order: { updatedAt: 'DESC' } });
}

async getApplication(seekerId: string, id: string) {
  const app = await this.appRepo.findOne({ where: { id, seeker: { id: seekerId } } });
  if (!app) throw new NotFoundException('Application not found');
  return app;
}

async applyToProgram(seekerId: string, dto: CreateApplicationDto) {
  const prog = await this.programRepo.findOne({ where: { id: dto.programId } });
  if (!prog) throw new NotFoundException('Program not found');

  const existing = await this.appRepo.findOne({
    where: { seeker: { id: seekerId }, program: { id: dto.programId } },
  });
  if (existing) return existing;

  const app = this.appRepo.create({
    seeker: { id: seekerId } as any,
    program: { id: dto.programId } as any,
    status: AppStatus.RESEARCHING,
    note: dto.note ?? null,
  });
  return this.appRepo.save(app);
}

async updateApplicationStatus(seekerId: string, id: string, dto: UpdateApplicationStatusDto) {
  const app = await this.getApplication(seekerId, id);
  await this.appRepo.update(app.id, { status: dto.status });
  return this.getApplication(seekerId, id);
}

async deleteApplication(seekerId: string, id: string) {
  const app = await this.getApplication(seekerId, id);
  await this.appRepo.delete(app.id);
  return { ok: true };
}

  async getAllNotices(): Promise<Notice[]> {
    try {
      return this.noticeRepo.find({ where: { isActive: true } });
    } catch (err) {
      throw new HttpException('Failed to fetch notices', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


}
