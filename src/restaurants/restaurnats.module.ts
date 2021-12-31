import { Module } from '@nestjs/common'
import { RestaurantsResolver } from './restaurants.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Restaurant } from './entities/restaurants.entity'
import { RestaurantsService } from './restaurants.service'
import { Category } from './entities/category.entity'
@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Category])],
  providers: [RestaurantsResolver, RestaurantsService],
})
export class RestaurantsModule {}
