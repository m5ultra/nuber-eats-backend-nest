import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CoreEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  updateAt: Date
}
