import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';
import { AUTH_ERROR_MESSAGES } from 'src/common/constants/error-message.constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'phoneNumber',
    });
  }

  async validate(phoneNumber: string, password: string) {
    const user = await this.authService.validateUser(phoneNumber, password);
    if (!user) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
    }
    return user;
  }
}
