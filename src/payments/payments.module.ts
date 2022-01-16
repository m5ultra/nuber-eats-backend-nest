import { Module } from '@nestjs/common'
import { Payment } from './entities/payment.entity'
import { PaymentsService } from './payments.service'
import { PaymentsResolver } from './payments.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Restaurant } from '../restaurants/entities/restaurants.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Restaurant])],
  providers: [PaymentsResolver, PaymentsService],
})
export class PaymentsModule {}
