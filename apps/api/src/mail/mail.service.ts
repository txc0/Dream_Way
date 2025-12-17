import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(to: string, name: string, token: string) {
    const verifyUrl = `http://localhost:4000/auth/verify?token=${token}`;

    await this.mailerService.sendMail({
      to,
      subject: 'Verify your account',
      template: './verification',
      context: {
        name,
        verifyUrl,
      },
    });
  }
}
