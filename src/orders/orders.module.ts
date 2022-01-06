import { Module } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { OrdersResolver } from './orders.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrderItem } from './entities/order-item.entity'
import { Order } from './entities/order.entity'
import { Restaurant } from '../restaurants/entities/restaurants.entity'
import { Dish } from '../restaurants/entities/dish.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Order, Restaurant, OrderItem, Dish])],
  providers: [OrdersService, OrdersResolver],
})
export class OrdersModule {}
