import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { register } from 'module';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { Role, User } from 'src/common/enities/user.entity';
import { Counselor } from 'src/counselor/entities/counselor.entity';
import { Seeker } from 'src/seeker/entities/seeker.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { LoginDto } from 'src/common/dtos/login.dto';
import { classToPlain, instanceToPlain } from 'class-transformer';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Counselor)
    private counselorRepo: Repository<Counselor>,

    @InjectRepository(Seeker)
    private seekerRepo: Repository<Seeker>,

    private jwtService: JwtService,
    private readonly mailservice: MailService,
  ) {}

  async generateVerificationToken(userId: string): Promise<string> {
    return this.jwtService.signAsync({ sub: userId }, { expiresIn: '15m' });
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      throw new Error('Invalid or expired token');
    }
  }

  async createUser(dto: CreateUserDto): Promise<any> {
    const { firstName, lastName, email, password, role } = dto;

    // Check if user exists
    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const baseData = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let savedUser: User;
    if (role === Role.COUNSELOR) {
      const counselor = this.counselorRepo.create(baseData);
      savedUser = await this.counselorRepo.save(counselor);
    } else if (role === Role.SEEKER) {
      const seeker = this.seekerRepo.create(baseData);
      savedUser = await this.seekerRepo.save(seeker);
    } else if ( role === Role.ADMIN) {
      const admin = this.userRepo.create(baseData);
      savedUser = await this.userRepo.save(admin);
    }
    else {
      throw new ConflictException(`Invalid Role: ${role}`);
    }

    if(savedUser.role != Role.ADMIN)
    {
      try {
        const token = await this.generateVerificationToken(savedUser.id);
        await this.mailservice.sendVerificationEmail(
        savedUser.email,
        savedUser.firstName,
        token,
        );
      console.log(`Verification email sent to ${savedUser.email}`);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
      }

    }
    return instanceToPlain(savedUser);
}

    
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not Found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('password mismatch');
    }
    return user;
  }

  async login(
    user: User,
  ): Promise<{ access_token: string; user: Partial<User> }> {
    const payload = { sub: user.id, role: user.role, email: user.email };
    const token = await this.jwtService.sign(payload, { expiresIn: '5d' });

    return {
      access_token: token,
      user: {
        id: user.id,
        role: user.role,
        firstName: user.firstName,
        email: user.email,
      },
    };
  }
}
