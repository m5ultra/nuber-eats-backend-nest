import { Injectable } from '@nestjs/common'
import { Restaurant } from './entities/restaurants.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto'
import { User } from '../users/entities/user.entity'
import { Category } from './entities/category.entity'

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly categorys: Repository<Category>,
  ) {}
  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput)
      newRestaurant.owner = owner
      const categoryName = createRestaurantInput.categoryName
        .trim()
        .toLowerCase()
      const coverImage = createRestaurantInput.coverImage
      const categorySlug = categoryName.replace(/ /g, '-')
      let category = await this.categorys.findOne({ slug: categorySlug })
      if (!category) {
        category = await this.categorys.save({
          slug: categorySlug,
          name: categoryName,
          coverImage: coverImage,
        })
      }
      newRestaurant.category = category
      await this.restaurants.save(newRestaurant)
      return {
        ok: true,
      }
    } catch (e) {
      return {
        ok: false,
        error: 'Could not create restaurant',
      }
    }
  }
}
