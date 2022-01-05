import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { Restaurant } from '../entities/restaurants.entity'
import {
  PaginationInput,
  PaginationOutput,
} from '../../common/dtos/pagination.dot'

@InputType()
export class SearchRestaurantInput extends PaginationInput {
  @Field(() => String)
  query: string
}

@ObjectType()
export class SearchRestaurantOutput extends PaginationOutput {
  @Field(() => [Restaurant])
  restaurants?: Restaurant[]

  @Field(() => Int, { nullable: true })
  totalItems?: number
}
