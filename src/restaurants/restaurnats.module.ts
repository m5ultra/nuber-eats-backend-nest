import { Module } from '@nestjs/common'
import { RestaurantsResolver } from './restaurants.resolver'
import { Query } from '@nestjs/graphql'
@Module({
  providers: [RestaurantsResolver],
})
export class RestaurantsModule {
  @Query((returns) => Boolean)
  isPizzaGood() {
    return true
  }
}
