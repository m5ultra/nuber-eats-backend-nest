import { Module } from '@nestjs/common'
import { Payment } from './entities/payment.entity'

@Module({
  imports: [Payment],
})
export class PaymentsModule {}
