// import got from 'got'
import axios from 'axios'
import { Inject, Injectable } from '@nestjs/common'
import { CONFIG_OPTIONS } from '../common/common.constants'
import { MailModuleOptions } from './mail.interface'
import FormData from 'form-data'

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}
  async sendEmail(subject: string, content: string, to: string) {
    const form = new FormData()
    form.append('form', `Excited User <mailgun@${this.options.domain}>`)
    form.append('to', ``)
    form.append('subject', subject)
    form.append('text', content)
    // const res = await got(
    //   `https://api.mailgun.net/v3/${this.options.domain}/messages`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       Authorization: `Basic ${Buffer.from(
    //         `api: ${this.options.apiKey}`,
    //       ).toString('base64')}`,
    //     },
    //     body: form,
    //   },
    // )

    const res = await axios({
      url: `https://api.mailgun.net/v3/${this.options.domain}/messages`,
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(
          `api: ${this.options.apiKey}`,
        ).toString('base64')}`,
      },
      data: form,
    })
    console.log(res)
  }
}
