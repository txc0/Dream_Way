import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { Status } from 'src/common/enities/consultation.entity';
import type { Request } from 'express';

@Controller('consultation')
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}
  @Post('request')
  async requestConsultation(
    @Body('seekerId') seekerId: string,
    @Body('counselorId') counselorId: string,
    @Body('fee') fee?: number,
  ) {
    return await this.consultationService.createRequest(
      seekerId,
      counselorId,
      fee,
    );
  }

  @Get('counselor/:id')
  async getConsultationsForCounselor(
    @Param('id') counselorId: string,
    @Body('status') status?: Status,
  ) {
    return await this.consultationService.getConsultationsForCounselor(
      counselorId,
      status,
    );
  }

  @Get('seeker/:id')
  async getConsultationsForSeeker(
    @Param('id') seekerId: string,
    @Body('status') status?: Status,
  ) {
    return await this.consultationService.getConsultationsForSeeker(
      seekerId,
      status,
    );
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') consultationId: string,
    @Body('status') status: Status,
  ) {
    return await this.consultationService.updateStatus(consultationId, status);
  }

  @Patch(':id/schedule')
  async scheduleAppointment(
    @Param('id') consultationId: string,
    @Body('appointmentTime') appointmentTime: Date,
    @Body('fee') fee: number,
  ) {
    return await this.consultationService.scheduleAppointment(
      consultationId,
      appointmentTime,
      fee,
    );
  }
  @Get()
  async getByStatus(@Req() req: Request, @Query('status') status: string) {
    const user = req.user as any;
    const counselorId = user.id;

    // Map dashboard-friendly statuses
    let statusesToFetch: Status | Status[];
    switch (status) {
      case 'REQUESTED':
        statusesToFetch = Status.REQUESTED;
        break;
      case 'APPOINTMENTS':
        statusesToFetch = [Status.ACCEPTED, Status.PAID];
        break;
      case 'COMPLETED':
        statusesToFetch = Status.COMPLETED;
        break;
      default:
        statusesToFetch = [];
    }

    return this.consultationService.getConsultationsByStatus(
      counselorId,
      statusesToFetch,
    );
  }
}
