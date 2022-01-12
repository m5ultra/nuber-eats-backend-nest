import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Reflector } from '@nestjs/core'
import { AllowedRoles, ROLES_KEY } from '../auth/role.decorator'
import { User } from '../users/entities/user.entity'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext()
    console.log(gqlContext.token, 'auth.guard.ts')
    const roles = this.reflector.get<AllowedRoles>(
      ROLES_KEY,
      context.getHandler(),
    )
    if (!roles) {
      return true
    }

    if (roles?.includes('Any')) {
      return true
    }
    const user: User = gqlContext.user
    if (!user) {
      return false
    }
    return roles.includes(user.role)
  }
}
