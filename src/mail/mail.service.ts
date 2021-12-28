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
    EmailVar.forEach((eVar) => form.append(`v:${eVar.key}`, eVar.value))
    try {
      // TODO：发送邮件失败 401未授权 1。可以考虑阿里云邮件服务 2。或者使用 nest-study测试成功发送邮件的方案 配合redis 存储邮箱和验证码的key-value 配置定时任务 清空过期的key-value 实现邮箱验证功能
      await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api: ${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: form,
      })
      // 可以正常获取数据
      // const res = await got('https://api.github.com/users/scott8013/repos', {
      //   method: 'get',
      // })
      // console.log(res, '我的git仓库列表')
    } catch (e) {
      console.log(e, '~~sendEmail~~')
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
