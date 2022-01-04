import { CoreOutput } from '../../common/dtos/output.dto'
import { Field, ObjectType } from '@nestjs/graphql'
import { Category } from '../entities/category.entity'

@ObjectType()
export class AllCategorysOutput extends CoreOutput {
  @Field(() => [Category], { nullable: true })
  categorys?: Category[]
}
