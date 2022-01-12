import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(ctx).getContext()
    // 放弃使用中件获取用户信息
    /**
     * 执行顺序1.先走中间件 2.app.module.ts GraphQLModule的配置 3.执行到auth-user拿到token 解析出User信息
     * 这是为了兼容Subscribe @AuthUser 参数装饰器获取不到User信息的问题
     */
    console.log(gqlContext.token, 'auth-user.decorator.ts')
    if (gqlContext.user) {
      return gqlContext.user
    } else {
      return null
    }
  },
)
