import { Args, Mutation, Resolver } from '@nestjs/graphql'
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto'
import { RestaurantsService } from './restaurants.service'
import { AuthUser } from '../guards/auth-user.decorator'
import { User } from '../users/entities/user.entity'
import { Restaurant } from './entities/restaurants.entity'
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from '../guards/auth.guard'

@Resolver(() => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}
  @Mutation((name) => CreateRestaurantOutput)
  @UseGuards(AuthGuard)
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantService.createRestaurant(
      authUser,
      createRestaurantInput,
    )
  }
}
