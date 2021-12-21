import { DynamicModule, Global, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthModuleOptions } from './auth-module-options.interface'
import { CONFIG_OPTIONS } from './auth.constants'

@Module({})
@Global()
export class AuthModule {
  static forRoot(options: AuthModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      exports: [AuthService],
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        AuthService,
      ],
    }
  }
}
