import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Reflector } from '@nestjs/core'
import { AllowedRoles, ROLES_KEY } from '../auth/role.decorator'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext()
    const roles = this.reflector.getAllAndOverride<AllowedRoles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    console.log(roles, 'Roles')
    if (roles.includes('Any')) {
      return true
    }
    const user = gqlContext.user
    if (!user) {
      return false
    }
    return true
  }
}
