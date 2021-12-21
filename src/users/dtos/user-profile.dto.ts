import { ArgsType, Field, ObjectType } from '@nestjs/graphql'
import { MutationOutputDto } from '../../common/dtos/output.dto'
import { User } from '../entities/user.entity'

@ArgsType()
export class UserProfileInput {
  @Field(() => Number)
  userId: number
}

@ObjectType()
export class UserProfileOut extends MutationOutputDto {
  @Field((type) => User, { nullable: true })
  user?: User
}
