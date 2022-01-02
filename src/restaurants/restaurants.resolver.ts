import { Args, Mutation, Resolver } from '@nestjs/graphql'
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto'
import { RestaurantsService } from './restaurants.service'
import { AuthUser } from '../guards/auth-user.decorator'
import { User } from '../users/entities/user.entity'
import { Restaurant } from './entities/restaurants.entity'
import { Role } from '../auth/role.decorator'

@Resolver(() => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Mutation(() => CreateRestaurantOutput)
  @Role(['Owner'])
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
