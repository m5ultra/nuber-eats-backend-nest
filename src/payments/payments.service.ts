import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Payment } from './entities/payment.entity'
import { Repository } from 'typeorm'
import {
  CreatePaymentInput,
  CreatePaymentOutput,
} from './dtos/create-payment.dto'
import { User } from '../users/entities/user.entity'
import { Restaurant } from '../restaurants/entities/restaurants.entity'

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}

  async createPayment(
    owner: User,
    { transactionId, restaurantId }: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId)
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found.',
        }
      }
      if (restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: 'You are not allowed to do this',
        }
      }
      await this.payments.save(
        this.payments.create({ transactionId, user: owner, restaurant }),
      )
      return {
        ok: true,
      }
    } catch (e) {
      return {
        ok: false,
        error: 'Could not create payment.',
      }
    }
  }
}
