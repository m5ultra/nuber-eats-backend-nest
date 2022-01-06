import { Module } from '@nestjs/common'
import {
  CategoryResolver,
  DishResolver,
  RestaurantsResolver,
} from './restaurants.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Restaurant } from './entities/restaurants.entity'
import { RestaurantsService } from './restaurants.service'
import { CategoryRepository } from './repositories/category.repositroy'
import { Dish } from './entities/dish.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, CategoryRepository, Dish])],
  providers: [
    RestaurantsResolver,
    CategoryResolver,
    DishResolver,
    RestaurantsService,
  ],
})
export class RestaurantsModule {}
