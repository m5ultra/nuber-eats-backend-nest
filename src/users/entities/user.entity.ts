import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql'
import * as bcrypt from 'bcrypt'
import { InternalServerErrorException } from '@nestjs/common'
import { IsBoolean, IsEnum, IsString } from 'class-validator'
import { Restaurant } from '../../restaurants/entities/restaurants.entity'
import { Order } from '../../orders/entities/order.entity'

export enum UserRole {
  Client = 'Client',
  Owner = 'Owner',
  Delivery = 'Delivery',
}
registerEnumType(UserRole, { name: 'UserRole' })

@InputType('UserInputType', { isAbstract: true })
@Entity()
@ObjectType()
export class User extends CoreEntity {
  @Column()
  @IsString()
  @Field(() => String)
  email: string

  @Column()
  @IsString()
  @Field(() => String)
  password: string

  @Column({ type: 'enum', enum: UserRole })
  @Field(() => UserRole)
  @IsEnum(UserRole)
  role: UserRole

  @Column({ default: false })
  @IsBoolean()
  @Field(() => Boolean)
  verified: boolean

  @Field(() => [Restaurant], { nullable: true })
  @OneToMany(() => Restaurant, (restaurant) => restaurant.category)
  restaurants: Restaurant[]

  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[]

  @Field((type) => [Order])
  @OneToMany((type) => Order, (order) => order.driver)
  rides: Order[]

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10)
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(aPassword, this.password)
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }
}
