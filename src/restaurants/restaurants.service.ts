import { Injectable } from '@nestjs/common'
import { Restaurant } from './entities/restaurants.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto'
import { User } from '../users/entities/user.entity'
import { EditRestaurantOutput } from './dtos/edit-restaurant.dto'
import { CategoryRepository } from './repositories/category.repositroy'
import { Category } from './entities/category.entity'
import { DeleteRestaurantOutput } from './dtos/delete-restaurant.dto'

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    private readonly categorys: CategoryRepository,
  ) {}

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput)
      newRestaurant.owner = owner
      newRestaurant.category = await this.categorys.getOrCreate(
        createRestaurantInput.categoryName,
        createRestaurantInput.coverImage,
      )
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

  async editRestaurant(
    owner: User,
    editRestaurant,
  ): Promise<EditRestaurantOutput> {
    try {
      // loadRelationIds: true 不会查关联数据的内容 只会返回一个ID
      const rest = await this.restaurants.findOne(editRestaurant.restaurantId, {
        loadRelationIds: true,
      })
      // 如果未找到
      if (!rest) {
        return {
          ok: false,
          error: 'Restaurant Not Found',
        }
      }

      if (+owner.id !== +rest.ownerId) {
        return {
          ok: false,
          error: "You can't edit a restaurant that you don't own",
        }
      }
      let category: Category = null
      if (editRestaurant.categoryName) {
        category = await this.categorys.getOrCreate(editRestaurant.categoryName)
      }

      // await this.restaurants.save([
      //   {
      //     id: editRestaurant.restaurantId,
      //     ...editRestaurant,
      //     ...(category && { category }),
      //   },
      // ])

      const updateData = { ...editRestaurant, ...(category && { category }) }
      delete updateData.restaurantId
      delete updateData.categoryName

      await this.restaurants.update(
        { id: editRestaurant.restaurantId },
        updateData,
      )
      return {
        ok: true,
      }
    } catch (e) {
      return {
        ok: false,
        error: 'Restaurant not found',
      }
    }
  }

  async deleteRestaurant(
    owner: User,
    restaurantId: string,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const res = await this.restaurants.findOne(restaurantId)
      if (!res) {
        return {
          ok: false,
          error: '未找到',
        }
      }
      if (owner.id !== res.ownerId) {
        return {
          ok: false,
          error: '未获取删除权限',
        }
      }
      /**
       * await this.restaurants.delete(restaurantId)
       * await this.restaurants.delete([id1, id2, id3])
       */
      await this.restaurants.delete(restaurantId)
      return {
        ok: true,
      }
    } catch (e) {
      return {
        ok: false,
        error: "Can't delete data",
      }
    }
  }
}
