import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from './output.dto'

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: null, nullable: true })
  pageNum?: number

  @Field(() => Int, { defaultValue: null, nullable: true })
  pageSize?: number
}

@ObjectType()
export class PaginationOutput extends CoreOutput {
  @Field(() => Int, { nullable: true })
  totalPages?: number

  @Field(() => Int, { nullable: true })
  totalResults?: number
}
