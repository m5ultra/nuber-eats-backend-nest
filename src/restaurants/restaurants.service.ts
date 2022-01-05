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
import { AllCategorysOutput } from './dtos/all-categorys.dto'
import { CategoryInput, CategoryOutput } from './dtos/category.dto'
import { RestaurantsInput, RestaurantsOutput } from './dtos/restaurants.dot'
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dot'

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

  async allCategorys(): Promise<AllCategorysOutput> {
    try {
      const categorys = await this.categorys.find()
      return {
        ok: true,
        categorys,
      }
    } catch (e) {
      return {
        ok: false,
        error: 'Could not load categories',
      }
    }
  }

  countRestaurants(category: Category) {
    return this.restaurants.count({ category })
  }

  async findCategoryBySlug({
    slug,
    pageSize,
    pageNum,
  }: CategoryInput): Promise<CategoryOutput> {
    try {
      const category = await this.categorys.findOne({ slug })
      if (!category) {
        return {
          ok: false,
          error: 'Category not found',
        }
      }
      let restaurants
      if (pageNum && pageNum) {
        restaurants = await this.restaurants.find({
          where: { category },
          take: pageSize,
          skip: (pageNum - 1) * pageSize,
        })
      } else {
        restaurants = await this.restaurants.find({
          where: { category },
        })
      }
      category.restaurants = restaurants
      const totalPages = await this.countRestaurants(category)
      return {
        ok: true,
        category,
        totalPages: pageSize === null ? 1 : Math.ceil(totalPages / pageSize),
      }
    } catch (e) {
      return {
        ok: false,
        error: 'Could not found categorys',
      }
    }
  }

  async allRestaurants({
    pageSize,
    pageNum,
  }: RestaurantsInput): Promise<RestaurantsOutput> {
    try {
      let restaurants
      // 分页
      if (pageSize && pageNum) {
        // restaurants = await this.restaurants.find({
        //   take: pageSize,
        //   skip: (pageNum - 1) * pageSize,
        // })
        restaurants = await this.restaurants.query(
          `SELECT * FROM restaurant LIMIT ${pageSize} OFFSET ${
            (pageNum - 1) * pageSize
          }`,
        )

        // ;[restaurants, totalPages] = await this.restaurants.findAndCount({
        //   take: pageSize,
        //   skip: (pageNum - 1) * pageSize,
        // })
      } else {
        // 查所有
        // restaurants = await this.restaurants.find()
        restaurants = await this.restaurants.query(`select * from restaurant`)
      }

      const totalPages =
        pageSize === null
          ? 1
          : Math.ceil((await this.restaurants.count()) / pageSize)
      return {
        ok: true,
        restaurants,
        totalPages,
      }
    } catch (e) {
      return {
        ok: false,
        error: 'Could not load restaurants',
      }
    }
  }

  async findRestaurantById({
    restaurantId,
  }: RestaurantInput): Promise<RestaurantOutput> {
    try {
      const restaurants = await this.restaurants.query(`
       SELECT * FROM restaurant WHERE id=${restaurantId}
      `)
      if (!restaurants.length) {
        return {
          ok: false,
          error: 'Not Found',
        }
      }
      return {
        ok: true,
        restaurant: restaurants[0],
      }
    } catch (e) {
      return {
        ok: true,
        error: 'Could Not Retrieval Restaurant By Id',
      }
    }
  }
}
