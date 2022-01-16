### 启动 mysql

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

### mysql 关闭严格模式

```shell
/usr/local/MySQL/bin/mysql -u root -p -e "SET GLOBAL sql_mode = 'NO_ENGINE_SUBSTITUTION';"
/usr/local/mysql/bin/mysql -u root -p -e "SELECT @@GLOBAL.sql_mode;"
```

## Nest Study

### 初始化工程

```shell
nest new nest-project-name
```

### 安装 swagger ---- 通过装饰器来快速生成开发文档的方式 （可选）

```shell
yarn add @nestjs/swagger
yarn add swagger-ui-express
```

[swagger 教程](https://cloud.tencent.com/developer/section/1490222)

### 安装 dotenv

```shell
yarn add  @nestjs/config
yarn add  cross-env
```

> @nestjs/config 内部集成了 dotenv
>
> cross-env 是一个 nodejs 跨平台的插件

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

创建 dto 文件

controller 使用

### 循环依赖

### VIM 指令

vim:
:lineNumber
:ngg/nG
Shfit + O 上行输入
o 下行输入
f( 将光标移动到 (上
df) 用 d 删除指令，删除当前位置到下一个 ) 的字符
$ 光标跳转到行未
^ 行首
w 下一个单词 (词首）
e 下一个单词（词尾）
b 前一个单词
x del 删除后一个字符
X backspace 删除前一个字符
u 撤销
ctrl + r 重做
i 插入，开始写东西
s 覆盖
esc 退出输入模式，进入普通模式，可执行各种命令
k 上
h 下
g 左
l 右
y 复制
yy 复制当前行
nyy 拷贝当前后开始的 n 行，比如 2yy 拷贝当前行及其下一行。
p 粘贴到后面
P 粘贴到前面
o 在当前行的下一行添加空行并开始输入
O 在当前行的上一行添加空行并开始输入
0（数字 0）移动到本行第一个字符上
f 查找字符，按 f 后再按需要移动到的字符，光标就会移动到那
f; 就会移动到下一个 ;的位置
F 反向查找字符
. 重复上一个操作
v 选择模式，用上下左右选择文本，按相应的指令直接执行，如：选中后执行 d 就直接删除选中的文本
ctrl + v 块状选择模式，可以纵向选择文本块，而非以行的形式
d 高级删除指令：
dw 删除一个单词
df( 配合 f ，删除从光标处到 ( 的字符，单行操作
dd 删除当前行
d2w 删除两个单词
d2t, 删除当前位置到后面第二个 , 之间的内容，不包含 , （t = to）
/ 从当前位置向后搜索
？ 从当前位置后前搜索
n 搜索完之后，如果有多个结果，跳到 下一个匹 配项
N 跳到 上一个 匹配项

- 直接匹配当前光标下面的字符串，移到下一个匹配项，跟/ ? 没有关系

# 上一个匹配项

可以使用：m 命令移动一行或一组行。实例：
：m 12 将当前行移到第 12 行之后
要移动行块，请使用相同的命令，但在输入 move 命令之前，请在视觉上选择行。您也可以在 move 命令中使用任意范围。实例：
：5,7M 21 将 5、6 和 7 号线移至 21 号线之后

向下搜索 /keywords

向上搜索 ?keywords

向下下一个 Ctrl+n

向上下一个 Ctrl+N

取消高亮 :nohl

- 搜索关闭所在处的单词

:w 保存文件但不退出 vi
:w file 将修改另外保存到 file 中，不退出 vi
:w! 强制保存，不推出 vi
:wq 保存文件并退出 vi
:wq! 强制保存文件，并退出 vi
:q 不保存文件，退出 vi
:q! 不保存文件，强制退出 vi
:e! 放弃所有修改，从上次保存文件开始再编辑命令历史

a 在当前位置后插入
A 在当前行尾插入

ra 将当前字符替换为 a，当期字符即光标所在字符。
s/old/new/ 用 old 替换 new，替换当前行的第一个匹配
s/old/new/g 用 old 替换 new，替换当前行的所有匹配
%s/old/new/ 用 old 替换 new，替换所有行的第一个匹配
%s/old/new/g 用 old 替换 new，替换整个文件的所有匹配
:10,20 s/^/ /g 在第 10 行知第 20 行每行前面加四个空格，用于缩进。
ddp 交换光标所在行和其下紧邻的一行。

###  需要完成功能 
1. upload files  存入缓存池 如果入库了 删除无用文件
2. 邮箱验证 如果使用第三方的需要付费 注册用户是生成验证码 如果超过一定时间 失效
3. 实现静态资源服务器

### 除了测试部分 课程已经学习完成

### 时间格式处理 数据库存时间戳
