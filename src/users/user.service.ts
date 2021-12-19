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

  async createAccount({ email, role, password }: CreateAccountInput) {
    // check new user
    // crate user & hash the password
    try {
      const exists = this.users.findOne({ email })
      if (exists) {
        // make error
        return
      }
      await this.users.save(this.users.create({ email, role, password }))
      return true
    } catch (e) {
      console.log(e)
      return
    }
  }
}
