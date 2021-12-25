import { BeforeInsert, Column, Entity } from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql'
import * as bcrypt from 'bcrypt'
import { InternalServerErrorException } from '@nestjs/common'
import { IsEnum, IsString } from 'class-validator'

enum UserRole {
  Client,
  Owner,
  Delivery,
}
registerEnumType(UserRole, { name: 'UserRole' })
@InputType({ isAbstract: true })
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

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10)
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException()
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(aPassword, this.password)
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException()
    }
  }
}
