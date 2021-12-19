import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from './entities/user.entity'
import { UsersService } from './user.service'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto'

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => Boolean)
  hi() {
    console.log('hi')
  }
  @Mutation((returns) => CreateAccountOutput)
  createAccount(@Args('input') createdAccountInput: CreateAccountInput) {
    return this.usersService.createAccount(createdAccountInput)
  }
}
