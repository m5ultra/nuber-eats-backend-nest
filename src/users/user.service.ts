import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { CreateAccountInput } from './dtos/create-account.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    role,
    password,
  }: CreateAccountInput): Promise<string | undefined> {
    // check new user
    // crate user & hash the password
    try {
      const exists = await this.users.findOne({ email })
      if (exists) {
        // make error
        return 'There is a user with the email already'
      }
      await this.users.save(this.users.create({ email, role, password }))
      return '用户创建成功'
    } catch (e) {
      return '创建账户失败'
    }
  }
}
