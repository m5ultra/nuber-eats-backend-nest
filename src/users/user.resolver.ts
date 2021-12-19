import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from './entities/user.entity'
import { UsersService } from './user.service'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto'

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => Boolean)
  hi() {
    console.log('hi')
  }
  @Mutation(() => CreateAccountOutput)
  async createAccount(
    @Args('input') createdAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const error = await this.usersService.createAccount(createdAccountInput)
      if (error) {
        return {
          ok: false,
          error,
        }
      }
    } catch (error) {
      return {
        ok: false,
        error,
      }
    }
  }
}
