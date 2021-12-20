import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthService {
  hello() {
    console.log('this is hello of auth.')
  }
}
