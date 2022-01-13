import { Inject, Injectable } from '@nestjs/common'
import { User, UserRole } from '../users/entities/user.entity'
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto'
import { Restaurant } from '../restaurants/entities/restaurants.entity'
import { OrderItem } from './entities/order-item.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Dish } from '../restaurants/entities/dish.entity'
import { Order, OrderStatus } from './entities/order.entity'
import { PubSub } from 'graphql-subscriptions'
import {
  NEW_COOKED_ORDER,
  NEW_ORDER_UPDATE,
  NEW_PENDING_ORDER,
  PUB_SUB,
} from 'src/common/common.constants'
import { GetOrdersInput } from './dtos/get-orders.dot'
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto'
import { EditOrderInput, EditOrderOutput } from './dtos/edit-order.dto'
import { TakeOrderInput, TakeOrderOutput } from './dtos/take-order.dto'

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
      // 判断餐馆是否存在
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
      return {
        ok: false,
        error: 'Could not create order.',
      }
    }
  }

  async getOrders(user: User, { status }: GetOrdersInput) {
    try {
      let orders: Order[]
      switch (user.role) {
        case UserRole.Client: {
          orders = await this.orders.find({
            where: { customer: user, ...(status && { status }) },
          })
          break
        }
        case UserRole.Delivery: {
          orders = await this.orders.find({
            where: { driver: user, ...(status && { status }) },
          })
          break
        }
        case UserRole.Owner: {
          const restaurants = await this.restaurants.find({
            where: { owner: user },
            // select: ['orders'],
            relations: ['orders'],
          })
          orders = restaurants.map((restaurant) => restaurant.orders).flat(1)
          if (status) {
            orders = orders.filter((order) => order.status === status)
          }
          break
        }
      }
      return {
        ok: true,
        orders: orders.filter((v) => v.status === status),
      }
    } catch (e) {
      return { ok: false, error: 'Could not get orders' }
    }
  }

  async getOrder(
    user: User,
    { id: OrderId }: GetOrderInput,
  ): Promise<GetOrderOutput> {
    try {
      const order = await this.orders.findOne(OrderId, {
        relations: ['restaurant'],
      })
      if (!order) {
        return {
          ok: false,
          error: 'Order not found.',
        }
      }
      if (!this.canSeeOrder(user, order)) {
        return {
          ok: false,
          error: "You can't see that.",
        }
      }
      return {
        ok: true,
        order,
      }
    } catch (e) {
      return {
        ok: false,
        error: 'Could not load order',
      }
    }
  }

  canSeeOrder(user: User, order: Order): boolean {
    let canSee = true
    if (user.role === UserRole.Client && order.customerId !== user.id) {
      canSee = false
    }
    if (user.role === UserRole.Delivery && order.driverId !== user.id) {
      canSee = false
    }
    if (user.role === UserRole.Owner && order.restaurant.ownerId !== user.id) {
      canSee = false
    }
    return canSee
  }

  async editOrder(
    user: User,
    { id: orderId, status }: EditOrderInput,
  ): Promise<EditOrderOutput> {
    try {
      const order = await this.orders.findOne(orderId, {
        relations: ['restaurant'],
      })
      if (!order) {
        return {
          ok: false,
          error: 'Order not found.',
        }
      }
      if (!this.canSeeOrder(user, order)) {
        return {
          ok: false,
          error: "You can't see this.",
        }
      }
      let canEdit = true
      if (user.role === UserRole.Client) {
        canEdit = false
      }
      if (user.role === UserRole.Owner) {
        if (status !== OrderStatus.Cooking && status !== OrderStatus.Cooked) {
          canEdit = false
        }
      }

      if (user.role === UserRole.Delivery) {
        if (
          status !== OrderStatus.Cooking &&
          status !== OrderStatus.Delivered
        ) {
          canEdit = false
        }
      }
      if (!canEdit) {
        return {
          ok: false,
          error: "You can't edit order status",
        }
      }
      await this.orders.save({
        id: orderId,
        status,
      })
      const newOrder = { ...order, status }
      if (user.role === UserRole.Owner) {
        if (status === OrderStatus.Cooked) {
          await this.pubSub.publish(NEW_COOKED_ORDER, {
            cookedOrders: newOrder,
          })
        }
      }
      await this.pubSub.publish(NEW_ORDER_UPDATE, { orderUpdates: newOrder })
      return {
        ok: true,
      }
    } catch (e) {
      return {
        ok: false,
        error: "Can't edit order",
      }
    }
  }

  async takeOrder(
    driver: User,
    { id: orderId }: TakeOrderInput,
  ): Promise<TakeOrderOutput> {
    try {
      const order = await this.orders.findOne(orderId)
      if (!order) {
        return {
          ok: false,
          error: 'Order not found.',
        }
      }
      // 如果已经有骑手了
      if (order.driver) {
        return {
          ok: false,
          error: 'This order already has a driver',
        }
      }
      // TODO 这里可能会有BUG save可能是新建操作 不是update action
      await this.orders.save([
        {
          id: orderId,
          driver,
        },
      ])
      await this.pubSub.publish(NEW_ORDER_UPDATE, {
        orderUpdates: { ...order, driver },
      })
      return {
        ok: true,
      }
    } catch (e) {
      return {
        ok: false,
        error: 'Could not update Order.',
      }
    }
  }
}
