import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql'
import { Restaurant } from '../entities/restaurants.entity'
import { MutationOutputDto } from '../../common/dtos/output.dto'
@InputType()
export class CreateRestaurantInput extends PickType(
  Restaurant,
  ['name', 'coverImage', 'address'],
  InputType,
) {
  @Field(() => String)
  categoryName: string
}

@ObjectType()
export class CreateRestaurantOutput extends MutationOutputDto {}
