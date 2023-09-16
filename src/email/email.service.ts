import { Injectable } from '@nestjs/common';
import FormData = require('form-data');
import Mailgun from 'mailgun.js';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService {
  private mailgun = new Mailgun(FormData);
  private mg = this.mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_KEY,
  });

  async sendEmail(sendEmailDto: SendEmailDto) {
    try {
      return await this.mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: 'Mailgun Sandbox <postmaster@sandbox0b8b17391b8746c3bc86f71843affbf8.mailgun.org>',
        ...sendEmailDto,
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}
