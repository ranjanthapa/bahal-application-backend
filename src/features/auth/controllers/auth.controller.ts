import { Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ZodBody } from 'src/common/decorators/zod-body.decorator';
import {
  CreateUserDTO,
  UserSchema,
} from 'src/features/user/schemas/user.schema';
import { LoginDTO, LoginSchema } from 'src/features/user/schemas/login.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@ZodBody(UserSchema) userDto: CreateUserDTO) {
    return await this.authService.register(userDto);
  }

  @Post('/login')
  async login(@ZodBody(LoginSchema) loginDto: LoginDTO) {
    return await this.authService.login(loginDto);
  }
}
