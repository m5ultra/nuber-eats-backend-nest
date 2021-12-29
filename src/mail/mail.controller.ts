import { Body, Controller, Post } from '@nestjs/common'
import { MailService } from './mail.service'

@Controller('email')
export class MailController {
  constructor(private emailService: MailService) {}

  @Post('/sendCode')
  async sendEmailCode(@Body() data) {
    return this.emailService.sendEmailCode(data)
  }
}
