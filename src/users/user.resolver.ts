import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from './entities/user.entity'
import { UsersService } from './user.service'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto'
import { LoginInput, LoginOutput } from './dtos/login.dto'
import { AuthUser } from '../guards/auth-user.decorator'
import { UserProfileInput, UserProfileOut } from './dtos/user-profile.dto'
import { Role } from '../auth/role.decorator'

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Role(['Any'])
  @Mutation(() => CreateAccountOutput, { name: 'register' })
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

  @Role(['Any'])
  @Query(() => User)
  // me(@Context() { user }) {
  me(@AuthUser() user: User) {
    if (!user) {
      return
    } else {
      return user
    }
  }

  @Mutation(() => LoginOutput, { name: 'login' })
  @Role(['Any'])
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      return this.usersService.login(loginInput)
    } catch (e) {
      return e
    }
  }

  @Query(() => UserProfileOut)
  @Role(['Any'])
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
