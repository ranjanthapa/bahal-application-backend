import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ZodBody } from 'src/common/decorators/zod-body.decorator';
import { User } from 'src/features/user/entities/user.entity';
import {
  CreateUserDTO,
  UserSchema,
} from 'src/features/user/schemas/user.schema';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @Post('/sign-up')
  async signUp(@ZodBody(UserSchema) userDto: CreateUserDTO) {
    await this.authService.register(userDto);
  }

  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }
}
