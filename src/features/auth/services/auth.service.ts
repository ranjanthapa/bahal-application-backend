import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/features/user/entities/user.entity';
import { CreateUserDTO } from 'src/features/user/schemas/user.schema';
import { UserService } from 'src/features/user/services/user.service';
import { Repository } from 'typeorm';
import { comparePassword } from '../utils/hash.util';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDTO) {
    return await this.userService.create(userDto);
  }

  async validateUser(
    phoneNumber: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userService.findByPhoneNumber(phoneNumber);
    if (!user) {
      return null;
    }
    const isPasswordCorrect = await comparePassword(password, user.password);
    return isPasswordCorrect ? user : null;
  }

  async login(user: User) {
    const payload: JwtPayload = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      phoneNumber: user.phoneNumber,
    };
    return {
      ...payload,
      token: this.jwtService.sign(payload),
    };
  }
}
