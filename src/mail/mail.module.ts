import { DynamicModule, Global, Module } from '@nestjs/common'
import { MailService } from './mail.service'
import { MailerModule } from '@nestjs-modules/mailer'
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter'
import { join } from 'path'
import { MailModuleOptions } from './mail.interface'
import { CONFIG_OPTIONS } from '../common/common.constants'

@Global()
@Module({})
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      imports: [
        MailerModule.forRootAsync({
          useFactory: () => ({
            transport: `smtp://${options.formEmail}:${options.code}@smtp.qq.com`,
            //是否开启预览 在调试模式下会自动打开一个网页 预览邮件
            // preview: true,
            defaults: {
              from: `"邮箱验证 请误回复" <${options.formEmail}>`,
            },
            template: {
              dir: join(__dirname, 'templates'),
              adapter: new PugAdapter(),
              options: {
                strict: true,
              },
            },
          }),
        }),
      ],
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        MailService,
      ],
      exports: [MailService],
    }
  }
}
