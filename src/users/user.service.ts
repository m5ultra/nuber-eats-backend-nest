import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { CreateAccountInput } from './dtos/create-account.dto'
import { LoginInput } from './dtos/login.dto'
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    role,
    password,
  }: CreateAccountInput): Promise<[boolean, string?]> {
    // check new user
    // crate user & hash the password
    try {
      const exists = await this.users.findOne({ email })
      if (exists) {
        // make error
        return [false, 'There is a user with the email already']
      }
      await this.users.save(this.users.create({ email, role, password }))
      return [true]
    } catch (e) {
      return [false, '创建账户失败']
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    // find the user with email
    // check if the password is correct
    // make a JWT and give it to the user
    try {
      const user = await this.users.findOne({ email })
      if (!user) {
        return { ok: false, error: 'User not found' }
      }
      const isPasswordCorrect = await user.checkPassword(password)
      if (!isPasswordCorrect) {
        return {
          ok: false,
          error: '密码错误',
        }
      }
      return {
        ok: true,
        token: 'this is token',
      }
    } catch (error) {
      return {
        error,
        ok: false,
      }
    }
  }
}
