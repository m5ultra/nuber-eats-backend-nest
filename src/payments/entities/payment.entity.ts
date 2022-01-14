import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ManyToOne, RelationId } from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'
import { User } from '../../users/entities/user.entity'

@InputType('PaymentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Payment extends CoreEntity {
  @Field((type) => Int)
  @Column()
  transactionId: number

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.payments)
  user: User

  @RelationId((order: Payment) => order.user)
  userId: number
}
