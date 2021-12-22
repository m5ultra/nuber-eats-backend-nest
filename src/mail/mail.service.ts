import got from 'got'
import { Inject, Injectable } from '@nestjs/common'
import { CONFIG_OPTIONS } from '../common/common.constants'
import { MailModuleOptions } from './mail.interface'
import * as FormData from 'form-data'

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    this.sendEmail('testing', 'test', 'ams9527@outlook.com').then((res) =>
      console.log(res),
    )
  }
  async sendEmail(subject: string, content: string, to: string) {
    const form = new FormData()
    form.append('form', `Excited User <mailgun@${this.options.domain}>`)
    form.append('to', `ams9527@outlook.com`)
    form.append('subject', subject)
    form.append('text', content)
    await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(
          `api: ${this.options.apiKey}`,
        ).toString('base64')}`,
      },
      body: form,
    })
  }
}
