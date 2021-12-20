import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { RestaurantsModule } from './restaurants/restaurnats.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import { UsersModule } from './users/users.module'
import { User } from './users/entities/user.entity'
import { Restaurant } from './restaurants/entities/restaurants.entity'
import { AuthModule } from './auth/auth.module';
console.log(process.env.NODE_ENV, '~~~env~~~')
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        SECRET_KEY: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Restaurant],
      // synchronize: process.env.NODE_ENV !== 'prod',
      synchronize: false,
      // logging: process.env.NODE_ENV !== 'prod',
      migrationsRun: false,
    }),
    RestaurantsModule,
    UsersModule,
    AuthModule.forRoot(),
  ],
})
export class AppModule {}
