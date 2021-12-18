import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Restaurant } from './entities/restaurants.entity'
import { Query } from '@nestjs/graphql'
import { CreateRestaurantDto } from './dtos/create-restaurant.dto'
@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  @Query((returns) => [Restaurant])
  restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
    return []
  }

  @Mutation((returns) => Boolean)
  createRestaurant(@Args() createRestaurantDto: CreateRestaurantDto): boolean {
    console.log(createRestaurantDto)
    return true
  }
}
