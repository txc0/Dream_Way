import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CounselorModule } from './counselor/counselor.module';
import { SeekerModule } from './seeker/seeker.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConsultationService } from './consultation/consultation.service';
import { ConsultationModule } from './consultation/consultation.module';
import { DocumentController } from './document/document.controller';
import { DocumentService } from './document/document.service';
import { DocumentModule } from './document/document.module';
import { ReviewModule } from './review/review.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.APP_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@gmail.com>',
      },
      template: {
        dir: join(__dirname, '../src/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // dev mode
    }),
    CounselorModule,
    SeekerModule,
    AuthModule,
    ConsultationModule,
    DocumentModule,
    ReviewModule,
    AdminModule,
  ],
  exports: [],
  providers: [],
  controllers: [DocumentController],
})
export class AppModule {}
