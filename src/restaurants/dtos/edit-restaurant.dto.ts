// import { Field, InputType, PartialType, PickType } from '@nestjs/graphql'
import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql'
// import { Restaurant } from '../entities/restaurants.entity'
import { CreateRestaurantInput } from './create-restaurant.dto'
import { CoreOutput } from '../../common/dtos/output.dto'

// @InputType()
// export class EditRestaurantInput extends PartialType(
//   PickType(Restaurant, ['address', 'name', 'coverImage']),
// ) {
//   @Field(() => String)
//   categoryName: string
// }

@InputType()
export class EditRestaurantInput extends PartialType(CreateRestaurantInput) {
  @Field(() => String)
  restaurantId: string
}

@ObjectType()
export class EditRestaurantOutput extends CoreOutput {}
