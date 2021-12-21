import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from './entities/user.entity'
import { UsersService } from './user.service'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto'
import { LoginInput, LoginOutput } from './dtos/login.dto'
import { AuthGuard } from '../guards/auth.guard'
import { UseGuards } from '@nestjs/common'
import { AuthUser } from '../guards/auth-user.decorator'
import { UserProfileInput, UserProfileOut } from './dtos/user-profile.dto'

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  @Mutation(() => CreateAccountOutput)
  async createAccount(
    @Args('input') createdAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const [ok, error] = await this.usersService.createAccount(
        createdAccountInput,
      )
      if (error) {
        return {
          ok,
          error,
        }
      }
      return { ok }
    } catch (error) {
      return {
        ok: false,
        error,
      }
    }
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      return this.usersService.login(loginInput)
    } catch (e) {
      return e
    }
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  // me(@Context() { user }) {
  me(@AuthUser() user: User) {
    if (!user) {
      return
    } else {
      console.log(user, 'user-resolver.ts')
      return user
    }
  }

  @Query(() => UserProfileOut)
  @UseGuards(AuthGuard)
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOut> {
    try {
      const user = await this.usersService.findUserById(userProfileInput.userId)
      if (!user) {
        return {
          ok: false,
          error: 'User Not Found',
        }
      }
      return {
        ok: Boolean(user),
        user,
      }
    } catch (e) {
      return {
        ok: false,
        error: 'User Not Found',
      }
    }
  }
}
