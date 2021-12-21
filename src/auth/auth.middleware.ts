import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { AuthService } from './auth.service'
import { UsersService } from '../users/user.service'

@Injectable()
// 解析客户端返回token 通过token中用户🆔 查找用户信息 并把用户信息挂载到req对象上
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('token' in req.headers) {
      const token = req.headers['token']
      const decoded = this.authService.verify(token.toString())
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        try {
          req['user'] = await this.userService.findUserById(decoded['id'])
          console.log(
            await this.userService.findUserById(decoded['id']),
            '9090',
          )
        } catch (e) {}
      }
    }
    next()
  }
}
