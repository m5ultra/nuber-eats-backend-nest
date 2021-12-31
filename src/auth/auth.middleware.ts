import { HttpException, Injectable, NestMiddleware } from '@nestjs/common'
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
    // body: {
    //   query: 'mutation {\n' +
    //   '  register(input: {email: "352671309@qq.com", role: Client, password: "www222888"}){\n' +
    //   '    ok,\n' +
    //   '    error\n' +
    //   '  }\n' +
    //   '}'
    // },
    const {
      body: { query },
    } = req
    const mutation = JSON.parse(JSON.stringify(query))
    if ('authorization' in req.headers) {
      const token = req.headers['authorization'].trim().split(' ')[1]
      let decoded
      try {
        decoded = this.authService.verify(token.toString())
      } catch (e) {
        throw new HttpException('token过期, 请重新登录', 401)
      }
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        try {
          req['user'] = await this.userService.findUserById(decoded['id'])
        } catch (e) {}
      }
    }
    next()
  }
}
