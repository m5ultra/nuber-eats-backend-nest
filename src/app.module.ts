import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { RestaurantsModule } from './restaurants/restaurnats.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import { UsersModule } from './users/users.module'
import { User } from './users/entities/user.entity'
import { Restaurant } from './restaurants/entities/restaurants.entity'
import { AuthModule } from './auth/auth.module'
import { AuthMiddleware } from './auth/auth.middleware'
import { Verification } from './users/entities/verification.entity'
import { MailModule } from './mail/mail.module'
import { Category } from './restaurants/entities/category.entity'
import { Dish } from './restaurants/entities/dish.entity'
import { OrdersModule } from './orders/orders.module'
import { Order } from './orders/entities/order.entity'
import { OrderItem } from './orders/entities/order-item.entity'
import { CommonModule } from './common/common.module'

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
        PRIVATE_KEY: Joi.string().required(),
        QQ_FROM_EMAIL: Joi.string().required(),
        QQ_AUTHORIZATION_CODE: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      // 每次发送请求会先执行中间件 在执行此处的代码
      context: ({ req }) => {
        // return { user: req['user'], token: req.headers['authorization'] }
        const {
          headers: { authorization: token },
        } = req
        return { token, name: 'Dendi' }
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User,
        Restaurant,
        Verification,
        Category,
        Dish,
        Order,
        OrderItem,
      ],
      // synchronize: process.env.NODE_ENV !== 'prod',
      synchronize: false,
      logging: process.env.NODE_ENV !== 'prod',
      migrationsRun: false,
    }),
    RestaurantsModule,
    UsersModule,
    AuthModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    MailModule.forRoot({
      formEmail: process.env.QQ_FROM_EMAIL,
      code: process.env.QQ_AUTHORIZATION_CODE,
    }),
    OrdersModule,
    CommonModule,
  ],
})

// TODO ws
// export class AppModule implements NestModule {
//   // 使用中间键
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(AuthMiddleware)
//       .forRoutes({ path: '/graphql', method: RequestMethod.POST })
//   }
// }
export class AppModule {}
