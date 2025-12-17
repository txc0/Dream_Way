import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/enities/user.entity';
import { Counselor } from 'src/counselor/entities/counselor.entity';
import { Seeker } from 'src/seeker/entities/seeker.entity';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from 'src/mail/mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Counselor, Seeker]),
    MailerModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES') || '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
