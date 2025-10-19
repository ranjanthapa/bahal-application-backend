import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ZodBody } from 'src/common/decorators/zod-body.decorator';
import { User } from 'src/features/user/entities/user.entity';
import {
  CreateUserDTO,
  UserSchema,
} from 'src/features/user/schemas/user.schema';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@ZodBody(UserSchema) userDto: CreateUserDTO) {
    return await this.authService.register(userDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }

}
