### 启动mysql
```shell
#启动MySQL服务
sudo /usr/local/MySQL/support-files/mysql.server start

#停止MySQL服务
sudo /usr/local/mysql/support-files/mysql.server stop

#重启MySQL服务
sudo /usr/local/mysql/support-files/mysql.server restart
```
```shell
mongod --dbpath /usr/local/var/mongodb --logpath /usr/local/var/log/mongodb/mongo.log --fork
```
## Nest Study

### 初始化工程

```shell
nest new nest-project-name
```

### 安装swagger ---- 通过装饰器来快速生成开发文档的方式 （可选）

```shell
yarn add @nestjs/swagger
yarn add swagger-ui-express
``` 

[swagger教程](https://cloud.tencent.com/developer/section/1490222)

### 安装 dotenv

```shell
yarn add  @nestjs/config
yarn add  cross-env
``` 

> @nestjs/config内部集成了dotenv
>
> cross-env是一个nodejs 跨平台的插件

#### 使用步骤

1.创建对应文件在根目录下 .env.development

```.env.development
DB_NAME = db.sqlite
```

.env.test

```.env.test
DB_NAME = test.sqlite
```

2. 修改启动指令如下：
   ![配置环境]("https://github.com/scott8013/readme-images/blob/main/1.%E5%90%AF%E5%8A%A8%E5%B7%A5%E7%A8%8B%E6%8C%87%E4%BB%A4.png?raw=true")
### 连接数据库
```app.module.ts
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest2', {
      connectionName: 'nest2',
    }),
    MongooseModule.forRoot('mongodb://localhost/nest', {
      connectionName: 'nest',
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

```user.module.ts
import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { User, UserSchema } from './schemas/user.schema'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      'nest',
    ),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
```

```user.service.ts
import { Injectable } from '@nestjs/common'
import { User, UserDocument } from './schemas/user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserDto } from './dtos/user-dto'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userDto: UserDto) {
    return await this.userModel.create(userDto)
  }
}

```

### 参数校验
// class-validator 生效的关键
```ts
  app.useGlobalPipes(new ValidationPipe())
```
```shell
yarn add class-transformer class-validator
```

```main.ts
  // class-validator 生效的关键
  app.useGlobalPipes(new ValidationPipe())
```
创建dto文件

controller使用
### 循环依赖


