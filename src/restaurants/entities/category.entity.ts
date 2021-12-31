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
  @Column({ unique: true })
  @IsString()
  @Length(5, 50, { message: '名字长度需要在5-50之间' })
  name: string

  @Field(() => String, { nullable: true })
  @Column({
    nullable: true,
  })
  @IsString()
  coverImage: string

  @Field()
  @Column()
  @IsString()
  slug: string

  @Field(() => [Restaurant], { nullable: true })
  @OneToMany(() => Restaurant, (restaurant) => restaurant.category)
  restaurants: Restaurant[]
}
