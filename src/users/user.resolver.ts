import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from './entities/user.entity'
import { UsersService } from './user.service'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto'
import { LoginInput, LoginOutput } from './dtos/login.dto'

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
  me(@Context() { user }) {
    if (!user) {
      return
    } else {
      return user
    }
  }
}
