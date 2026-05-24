import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendOtp(to: string, name: string, otp: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Your OTP Code',
      template: 'otp',
      context: {
        name,
        otp,
        expiryMinutes: 10,
        year: new Date().getFullYear(),
        appName: process.env.APP_NAME,
      },
    });
  }
}
