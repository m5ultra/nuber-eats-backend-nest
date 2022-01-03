import { Module } from '@nestjs/common'
import { RestaurantsResolver } from './restaurants.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Restaurant } from './entities/restaurants.entity'
import { RestaurantsService } from './restaurants.service'
import { CategoryRepository } from './category.repositroy'

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, CategoryRepository])],
  providers: [RestaurantsResolver, RestaurantsService],
})
export class RestaurantsModule {}
