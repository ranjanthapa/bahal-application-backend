import {
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/features/user/entities/user.entity';
import { LoginDTO } from 'src/features/user/schemas/login.schema';
import { CreateUserDTO } from 'src/features/user/schemas/user.schema';
import { UserService } from 'src/features/user/services/user.service';
import { Repository } from 'typeorm';
import { comparePassword } from '../utils/hash.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly userService: UserService,
  ) {}

  async register(userDto: CreateUserDTO) {
    return await this.userService.create(userDto);
  }

  async login(loginDto: LoginDTO) {
    const { identifier } = loginDto;
    let user: User | null = null;
    if (identifier?.isEmail) {
      user = await this.userService.findByEmail(identifier.value);
    } else {
      user = await this.userService.findByPhoneNumber(identifier!.value);
    }

    if (!user || !(await comparePassword(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      message: 'Login successful',
      user,
    };
  }
}
