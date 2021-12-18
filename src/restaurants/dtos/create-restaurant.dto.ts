import { Field, ArgsType } from '@nestjs/graphql'
import { IsString, IsBoolean, Length } from 'class-validator'
@ArgsType()
export class CreateRestaurantDto {
  @IsString()
  @Length(5, 10)
  @Field((type) => String)
  name: string
  @IsBoolean()
  @Field((type) => Boolean)
  isVegan: true
  @IsString()
  @Field((type) => String)
  address: string
  @IsString()
  @Length(5, 10)
  @Field((type) => String)
  ownerName: string
}
