import { Injectable } from '@nestjs/common'
import { Restaurant } from './entities/restaurants.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateRestaurantDto } from './dtos/create-restaurant.dto'
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto'

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}
  getAll(): Promise<Restaurant[]> {
    return this.restaurants.find()
  }
  createRestaurant(
    creatRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    const newRestaurant = this.restaurants.create(creatRestaurantDto)
    return this.restaurants.save(newRestaurant)
  }

  updateRestaurant({ id, data }: UpdateRestaurantDto) {
    return this.restaurants.update(id, { ...data })
  }
}
