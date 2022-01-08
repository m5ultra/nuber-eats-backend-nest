import { Inject, Injectable } from '@nestjs/common'
import { User } from '../users/entities/user.entity'
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto'
import { Restaurant } from '../restaurants/entities/restaurants.entity'
import { OrderItem } from './entities/order-item.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Dish } from '../restaurants/entities/dish.entity'
import { Order } from './entities/order.entity'
import { PubSub } from 'graphql-subscriptions'
import {
  NEW_COOKED_ORDER,
  NEW_ORDER_UPDATE,
  NEW_PENDING_ORDER,
  PUB_SUB,
} from 'src/common/common.constants'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async createOrder(
    customer: User,
    { restaurantId, items }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId)
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        }
      }
      let orderFinalPrice = 0
      const orderItems: OrderItem[] = []
      for (const item of items) {
        const dish = await this.dishes.findOne(item.dishId)
        if (!dish) {
          return {
            ok: false,
            error: 'Dish not found.',
          }
        }
        let dishFinalPrice = dish.price
        for (const itemOption of item.options) {
          const dishOption = dish.options.find(
            (dishOption) => dishOption.name === itemOption.name,
          )
          if (dishOption) {
            if (dishOption.extra) {
              dishFinalPrice = dishFinalPrice + dishOption.extra
            } else {
              const dishOptionChoice = dishOption.choices?.find(
                (optionChoice) => optionChoice.name === itemOption.choice,
              )
              if (dishOptionChoice) {
                if (dishOptionChoice.extra) {
                  dishFinalPrice = dishFinalPrice + dishOptionChoice.extra
                }
              }
            }
          }
        }
        orderFinalPrice = orderFinalPrice + dishFinalPrice
        const orderItem = await this.orderItems.save(
          this.orderItems.create({
            dish,
            options: item.options,
          }),
        )
        orderItems.push(orderItem)
      }
      const order = await this.orders.save(
        this.orders.create({
          customer,
          restaurant,
          total: orderFinalPrice,
          items: orderItems,
        }),
      )
      await this.pubSub.publish(NEW_PENDING_ORDER, {
        pendingOrders: { order, ownerId: restaurant.ownerId },
      })
      return {
        ok: true,
        orderId: order.id,
      }
    } catch (e) {
      console.log(e)
      return {
        ok: false,
        error: 'Could not create order.',
      }
    }
  }
}
