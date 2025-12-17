import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from 'src/common/enities/user.entity';
import { Notice } from 'src/common/enities/notice.entity';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { UpdateUserDto } from 'src/common/dtos/update-user.dto';
import { PusherService } from 'src/pusher/pusher.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Notice) private readonly noticeRepo: Repository<Notice>,
    private readonly pusher: PusherService,
  ) {}

  // ---- Users ----
  async getAllUsers(): Promise<User[]> {
    return this.userRepo.find({ 
      where: [{ role: Role.SEEKER }, { role: Role.COUNSELOR }] 
    });
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (dto.role && ![Role.SEEKER, Role.COUNSELOR].includes(dto.role)) {
      throw new BadRequestException('Role must be seeker or counselor');
    }

    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async deleteUser(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.userRepo.remove(user);
    return { message: 'User deleted successfully', id };
  }

  // ---- Notices ----
  async getAllNotices(): Promise<Notice[]> {
    return this.noticeRepo.find({ where: { isActive: true } });
  }

  async getNoticeById(id: string): Promise<Notice> {
    const notice = await this.noticeRepo.findOne({ where: { id } });
    if (!notice) throw new NotFoundException('Notice not found');
    return notice;
  }

  async createNotice(dto: CreateNoticeDto): Promise<Notice> {
  const notice = this.noticeRepo.create(dto);
  const saved = await this.noticeRepo.save(notice);

  const payload = {
    id: saved.id,
    title: saved.title,
    content: saved.content,
    createdAt: saved.createdAt,
  };

  await this.pusher.trigger('notices', 'new-notice', payload);
  return saved;
}

async updateNotice(id: string, dto: UpdateNoticeDto): Promise<Notice> {
  const notice = await this.noticeRepo.preload({ id, ...dto });
  if (!notice) throw new NotFoundException('Notice not found');

  const saved = await this.noticeRepo.save(notice);

  const payload = {
    id: saved.id,
    title: saved.title,
    content: saved.content,
    updatedAt: saved.updatedAt,
  };

  await this.pusher.trigger('notices', 'update-notice', payload);
  return saved;
}

async deleteNotice(id: string) {
  const notice = await this.noticeRepo.findOne({ where: { id } });
  if (!notice) throw new NotFoundException('Notice not found');

  const payload = {
    id: notice.id,
    title: notice.title || 'Untitled',
    deletedAt: new Date(),
  };

  await this.noticeRepo.remove(notice);
  await this.pusher.trigger('notices', 'delete-notice', payload);
  return { message: 'Notice deleted successfully', id };
}


}