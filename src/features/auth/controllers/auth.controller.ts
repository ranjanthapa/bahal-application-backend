import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ZodBody } from 'src/common/decorators/zod-body.decorator';
import { User } from 'src/features/user/entities/user.entity';
import {
  CreateUserDto,
  UserSchema,
} from 'src/features/user/schemas/user.schema';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { VerifyOTPDto, verifyOTPSchema } from '../schemas/verify-otp.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @Post('/sign-up')
  async signUp(@ZodBody(UserSchema) userDto: CreateUserDto) {
    await this.authService.register(userDto);
    return {
      message: 'User registered sucessfully',
    };
  }

  @PublicRoute()
  @Post('/verify-otp')
  async verify(@ZodBody(verifyOTPSchema) otpDto: VerifyOTPDto) {
    await this.authService.verifyOtp(otpDto);
    return {
      message: "Otp verify successfull"
    }
  }

  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }
}
