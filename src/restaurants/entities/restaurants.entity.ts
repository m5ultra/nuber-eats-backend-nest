import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { IsString, IsBoolean, Length, IsOptional } from 'class-validator'

@ObjectType()
@Entity()
export class Restaurant {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number

  @IsString()
  @Length(5, 10, { message: '名字长度需要在5-10' })
  @Column()
  @Field(() => String)
  name: string

  @Column({ default: true })
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { defaultValue: true })
  isVegan: boolean

  @Column()
  @IsString()
  @Field(() => String)
  address: string

  @Column()
  @IsString()
  @Field(() => String)
  ownerName: string

  @Column()
  @IsString()
  @Field(() => String)
  categoryName: string
}
