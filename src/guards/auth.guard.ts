import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Reflector } from '@nestjs/core'
import { AllowedRoles, ROLES_KEY } from '../auth/role.decorator'
import { User } from '../users/entities/user.entity'
import { AuthService } from '../auth/auth.service'
import { UsersService } from '../users/user.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext()
    const roles = this.reflector.get<AllowedRoles>(
      ROLES_KEY,
      context.getHandler(),
    )

    // 1.0 如果用户没有使用  @Role(['Any']) roles未  falsely
    if (!roles) {
      return true
    }
    // 2.0 token不存在
    const token = gqlContext?.token?.trim()?.split(' ')[1]
    if (!token) {
      return false
    }
    let decoded
    try {
      decoded = this.authService.verify(token.toString())
    } catch (e) {
      throw new HttpException('token过期, 请重新登录', 401)
    }

    if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
      try {
        const user = await this.userService.findUserById(decoded['id'])
        // 3.0 用户不存在
        if (!user) {
          return false
        }

        // 4.0 如果 roles中包含Any 所有人都可以访问
        if (roles?.includes('Any')) {
          gqlContext['user'] = user
          return true
        }

        // 5.0  roles是否包含 @Role(['Any'])的角色 这里是 "Any"
        return roles.includes(user.role)
      } catch (e) {}
    }
  }
}
