import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Category } from '../entities/category.entity'
import {
  PaginationInput,
  PaginationOutput,
} from '../../common/dtos/pagination.dot'

@InputType()
export class CategoryInput extends PaginationInput {
  @Field(() => String)
  slug: string
}

@ObjectType()
export class CategoryOutput extends PaginationOutput {
  @Field(() => Category, { nullable: true })
  category?: Category
}
