import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDTO } from '../schemas/user.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/features/auth/utils/hash.util';
import { USER_ERROR_MESSAGES } from 'src/common/constants/error-message.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  async create(userDto: CreateUserDTO): Promise<User> {
    const isUserExists = await this.userRepo.findOne({
      where: { phoneNumber: userDto.phoneNumber },
    });

    if (isUserExists) {
      throw new ConflictException(USER_ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }

    const password = await hashPassword(userDto.password);
    const user = this.userRepo.create({ ...userDto, password });
    return await this.userRepo.save(user);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { phoneNumber: phoneNumber } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { email: email } });
  }
}
