import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Restaurant } from './entities/restaurants.entity'
import { Query } from '@nestjs/graphql'
import { CreateRestaurantDto } from './dtos/create-restaurant.dto'
import { RestaurantsService } from './restaurants.service'
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto'
@Resolver(() => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}
  @Query(() => [Restaurant])
  restaurants(@Args('veganOnly') veganOnly: boolean): Promise<Restaurant[]> {
    console.log(veganOnly)
    return this.restaurantService.getAll()
  }

  @Mutation(() => Boolean)
  async createRestaurant(
    @Args('input') createRestaurantDto: CreateRestaurantDto,
  ): Promise<boolean> {
    try {
      await this.restaurantService.createRestaurant(createRestaurantDto)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  @Mutation(() => Boolean)
  async updateRestaurant(
    @Args() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<boolean> {
    try {
      await this.restaurantService.updateRestaurant(updateRestaurantDto)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
