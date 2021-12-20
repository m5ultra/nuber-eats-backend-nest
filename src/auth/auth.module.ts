import { DynamicModule, Global, Module } from '@nestjs/common'
import { AuthService } from './auth.service'

@Module({})
@Global()
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
      exports: [AuthService],
      providers: [AuthService],
    }
  }
}
