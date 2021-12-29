import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany } from 'typeorm'
import { IsString, Length } from 'class-validator'
import { CoreEntity } from '../../common/entities/core.entity'
import { Restaurant } from './restaurants.entity'

@ObjectType()
@InputType('CategoryInputType', { isAbstract: true })
@Entity()
export class Category extends CoreEntity {
  @Field(() => String)
  @IsString()
  @Length(5, null, { message: '名字长度需要在5' })
  @Column()
  name: string

  @Field(() => String)
  @Column()
  @IsString()
  coverImage: string

  @Field(() => [Restaurant], { nullable: true })
  @OneToMany(() => Restaurant, (restaurant) => restaurant.category)
  restaurants: Restaurant[]
}
