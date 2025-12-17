import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Put,
} from '@nestjs/common';
import { CounselorService } from './counselor.service';
import { CreateCounselorDto } from './dto/create-counselor.dto';
import { UpdateCounselorDto } from './dto/update-counselor.dto';
import { Status } from 'src/common/enities/consultation.entity';
import { Counselor } from './entities/counselor.entity';

@Controller('counselor')
export class CounselorController {
  constructor(private readonly counselorService: CounselorService) {}

  @Get('verified')
  async getVerifiedCounselors() {
    return await this.counselorService.getVerifiedCounselors();
  }

  @Get('specialization/:id')
  async findBySpecialization(@Param('id') specializationId: string) {
    return await this.counselorService.findCounselorsBySpecialization(
      specializationId,
    );
  }

  @Get(':id/reviews')
  async getReviews(@Param('id') counselorId: string) {
    return await this.counselorService.getReviews(counselorId);
  }

  @Get('consultations/:status')
  async getConsultationsByStatus(
    @Req() req: any,
    @Param('status') status: Status,
  ) {
    const seekerId = req.user.id; // from JWT
    return await this.counselorService.getConsultationsByStatus(
      seekerId,
      status,
    );
  }

  @Get('profile')
  async getProfile(@Req() req: any) {
    const counselorId = req.user.id;
    return this.counselorService.getProfile(counselorId);
  }

  @Put('profile')
  async updateProfile(@Req() req: any, @Body() body: Partial<Counselor>) {
    const counselorId = req.user.id;
    return this.counselorService.updateProfile(counselorId, body);
  }
}
