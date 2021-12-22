import got from 'got'
import { Inject, Injectable } from '@nestjs/common'
import { CONFIG_OPTIONS } from '../common/common.constants'
import { EmailVar, MailModuleOptions } from './mail.interface'
import * as FormData from 'form-data'

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}
  private async sendEmail(
    subject: string,
    to: string,
    template: string,
    EmailVar: EmailVar[],
  ) {
    const form = new FormData()
    form.append('form', `Nico from Nuber eats <mailgun@${this.options.domain}>`)
    form.append('subject', subject)
    form.append('to', to)
    form.append('template', template)
    EmailVar.forEach((eVar) => form.append(eVar.key, eVar.value))
    try {
      await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api: ${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: form,
      })
    } catch (e) {
      console.log(e)
    }
  }

  async sendVerificationEmail(email: string, code: string) {
    await this.sendEmail(
      'Verify Your Email',
      '352671309@qq.com',
      'nest-confirm-email',
      [
        { key: code, value: code },
        { key: 'username', value: email },
      ],
    )
  }
}
