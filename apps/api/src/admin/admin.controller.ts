import { 
  Controller, Get, Post, Put, Patch, Delete, 
  Body, Param, UseGuards 
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { UpdateUserDto } from 'src/common/dtos/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ---- Users ----
  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.adminService.updateUser(id, dto);
  }

  @Put('users/:id')
  replaceUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.adminService.updateUser(id, dto); // reuse same logic
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // ---- Notices ----
  @Get('notices')
  getAllNotices() {
    return this.adminService.getAllNotices();
  }

  @Get('notices/:id')
  getNotice(@Param('id') id: string) {
    return this.adminService.getNoticeById(id);
  }

  @Post('notices')
  createNotice(@Body() dto: CreateNoticeDto) {
    return this.adminService.createNotice(dto);
  }

  @Patch('notices/:id')
  updateNotice(@Param('id') id: string, @Body() dto: UpdateNoticeDto) {
    return this.adminService.updateNotice(id, dto);
  }

  @Put('notices/:id')
  replaceNotice(@Param('id') id: string, @Body() dto: UpdateNoticeDto) {
    return this.adminService.updateNotice(id, dto);
  }

  @Delete('notices/:id')
  deleteNotice(@Param('id') id: string) {
    return this.adminService.deleteNotice(id);
  }
}
