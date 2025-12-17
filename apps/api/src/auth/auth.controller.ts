import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from 'src/common/enities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/common/dtos/login.dto';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { classToPlain } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  @Get('verify')
  async verifyUser(@Query('token') token: string) {
    try {
      const payload = await this.authService.verifyToken(token);
      const userId: string = payload.sub;

      await this.userRepo.update(userId, { isVerified: true });

      return 'Your email has been verified!';
    } catch (e) {
      throw new BadRequestException('Invalid or expired verification token');
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async registerUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.authService.createUser(dto);
  }
}
