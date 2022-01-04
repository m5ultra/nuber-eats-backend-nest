import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { IsString } from 'class-validator'

@InputType()
export class DeleteRestaurantInput {
  @IsString({ message: '需要字符串类型！！！' })
  @Field(() => String, { nullable: false })
  restaurantId: string
}

@ObjectType()
export class DeleteRestaurantOutput extends CoreOutput {}
