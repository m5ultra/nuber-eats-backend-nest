import { Inject, Injectable } from '@nestjs/common'
import { AuthModuleOptions } from './auth.interfaces'
import { CONFIG_OPTIONS } from './auth.constants'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: AuthModuleOptions,
  ) {}
  sign(userId: number): string {
    return jwt.sign({ id: userId }, this.options.privateKey)
  }
}
