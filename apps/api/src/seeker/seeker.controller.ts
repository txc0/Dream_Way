import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  Put,
  Query,
  ParseUUIDPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { SeekerService } from './seeker.service';
import { Status } from 'src/common/enities/consultation.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Seeker } from './entities/seeker.entity';
import { QueryProgramsDto } from 'src/common/dtos/query-program.dto';
import { CreateProgramDto } from 'src/common/dtos/create-program.dto';
import { UpdateProgramDto } from 'src/common/dtos/update-program.dto';
import { QueryApplicationsDto } from './dto/query-application.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application.dto';

@Controller('seeker')
@UseGuards(JwtAuthGuard)
export class SeekerController {
  constructor(private readonly seekerService: SeekerService) {}

  // ---------------- Consultations ----------------

  // GET /seeker/consultations/:status
  @Get('consultations/:status')
  async getConsultationsByStatus(
    @Req() req: any,
    @Param('status') status: Status,
  ) {
    const seekerId = req.user.id; // from JWT
    return await this.seekerService.getConsultationsByStatus(seekerId, status);
  }

  // ---------------- Documents ----------------

  // GET /seeker/docs
  @Get('docs')
  async getDocs(@Req() req: any) {
    const seekerId = req.user.id;
    return await this.seekerService.getDocs(seekerId);
  }

  // POST /seeker/docs
  @Post('docs')
  async uploadDoc(
    @Req() req: any,
    @Body() body: { fileName: string; filePath: string; encrypted?: boolean },
  ) {
    const seekerId = req.user.id;
    return await this.seekerService.uploadDoc(
      seekerId,
      body.fileName,
      body.filePath,
      body.encrypted,
    );
  }

  // ---------------- Reviews ----------------

  // GET /seeker/reviews
  @Get('reviews')
  async getReviews(@Req() req: any) {
    const seekerId = req.user.id;
    return await this.seekerService.getReviews(seekerId);
  }

  @Get('profile')
  async getProfile(@Req() req: any) {
    const seekerId = req.user.id;
    return this.seekerService.getProfile(seekerId);
  }

  @Put('profile')
  async updateProfile(@Req() req: any, @Body() body: Partial<Seeker>) {
    const seekerId = req.user.id;
    return this.seekerService.updateProfile(seekerId, body);
  }

  @Get('programs')
  listPrograms(@Query() q: QueryProgramsDto) {
    return this.seekerService.listPrograms(q);
  }

  @Get('programs/:id')
  getProgram(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.seekerService.getProgram(id);
  }

  @Post('programs')
  createProgram(@Req() req: any, @Body() dto: CreateProgramDto) {
    return this.seekerService.createProgram(req.user.id, dto);
  }

  @Put('programs/:id')
  updateProgram(
    @Req() req: any,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProgramDto,
  ) {
    return this.seekerService.updateProgram(req.user.id, id, dto);
  }

  @Get('applications')
  listApplications(@Req() req: any, @Query() q: QueryApplicationsDto) {
    return this.seekerService.listApplications(req.user.id, q);
  }

  @Get('applications/:id')
  getApplication(
    @Req() req: any,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.seekerService.getApplication(req.user.id, id);
  }

  @Post('applications')
  apply(@Req() req: any, @Body() dto: CreateApplicationDto) {
    return this.seekerService.applyToProgram(req.user.id, dto);
  }

  @Patch('applications/:id/status')
updateStatus(
  @Req() req: any,
  @Param('id', new ParseUUIDPipe()) id: string,
  @Body() dto: UpdateApplicationStatusDto,
) {
  return this.seekerService.updateApplicationStatus(req.user.id, id, dto);
}

@Delete('applications/:id')
removeApplication(@Req() req: any, @Param('id', new ParseUUIDPipe()) id: string) {
  return this.seekerService.deleteApplication(req.user.id, id);
}

  @Get('notices')
  getAllNotices() {
    return this.seekerService.getAllNotices();
  }

}
