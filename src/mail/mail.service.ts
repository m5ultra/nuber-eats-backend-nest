import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ISendEmailOptions } from './mail.interface'
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailCode(data: ISendEmailOptions) {
    const { email, subject, sign, code } = data
    try {
      const date = new Date()
      const sendMailOptions: ISendMailOptions = {
        to: email,
        subject: subject || '用户邮箱验证',
        template: './validate.code.pug',
        context: {
          code,
          date,
          sign: sign || '系统邮件,回复无效。',
        },
      }
      const res = await this.mailerService.sendMail(sendMailOptions)
      if (res.response.indexOf('OK') > -1) {
        return {
          msg: '邮件发送成功',
        }
      }
    } catch (e) {
      return {
        statesCode: 500,
        message: '邮件发送失败',
      }
    }
  }
}
