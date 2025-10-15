import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  async signUp() {
    console.log('hello');
  }
}
