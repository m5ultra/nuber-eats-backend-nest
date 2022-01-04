import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ManyToOne, RelationId } from 'typeorm'
import { IsString, Length } from 'class-validator'
import { CoreEntity } from '../../common/entities/core.entity'
import { Category } from './category.entity'
import { User } from '../../users/entities/user.entity'

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Field(() => String)
  @IsString()
  @Length(4, 50)
  @Column({ unique: true })
  name: string

  @Field(() => String)
  @Column()
  @IsString()
  coverImage: string

  @Field(() => String, { defaultValue: 'CN' })
  @Column()
  @IsString()
  address: string

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  category: Category

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.restaurants)
  owner: User

  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number
}
