import { CoreOutput } from '../../common/dtos/output.dto'
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql'
import { User } from '../entities/user.entity'

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field(() => String, { nullable: true })
  token?: string
}

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}
