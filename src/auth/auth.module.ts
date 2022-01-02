import { DynamicModule, Global, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthModuleOptions } from './auth-module-options.interface'
import { CONFIG_OPTIONS } from '../common/common.constants'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from '../guards/auth.guard'

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
@Global()
export class AuthModule {
  static forRoot(options: AuthModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          useValue: options,
          provide: CONFIG_OPTIONS,
        },
        AuthService,
      ],
      exports: [AuthService],
    }
  }
}
