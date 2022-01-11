import { Inject, Injectable } from '@nestjs/common'
import { AuthModuleOptions } from './auth.interfaces'
import * as jwt from 'jsonwebtoken'
import { CONFIG_OPTIONS } from '../common/common.constants'

@Injectable()
export class AuthService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: AuthModuleOptions,
  ) {}

  sign(userId: number): string {
    return jwt.sign({ id: userId }, this.options.privateKey, {
      expiresIn: '24h',
    })
  }

  verify(token: string) {
    return jwt.verify(token, this.options.privateKey)
  }
}
