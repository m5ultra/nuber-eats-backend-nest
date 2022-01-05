import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { PaginationInput } from '../../common/dtos/pagination.dot'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Restaurant } from '../entities/restaurants.entity'

@InputType()
export class RestaurantInput extends PaginationInput {}

@ObjectType()
export class RestaurantOutput extends CoreOutput {
  @Field(() => [Restaurant], { nullable: true })
  restaurants?: Restaurant[]

  @Field(() => Int, { nullable: true })
  totalPages?: number
}
