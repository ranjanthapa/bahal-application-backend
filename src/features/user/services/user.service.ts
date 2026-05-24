import { ConflictException, Injectable } from '@nestjs/common';
import { USER_ERROR_MESSAGES } from 'src/common/constants/error-message.constants';
import { hashPassword } from 'src/features/auth/utils/hash.util';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from '../schemas/user.schema';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}

  async create(userDto: CreateUserDto, manager?: EntityManager): Promise<User> {
    const { email, phoneNumber } = userDto;
    const isUserExists = await this.userRepo.isUserExist({
      email,
      phoneNumber,
    });

    if (isUserExists) {
      throw new ConflictException(USER_ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }

    const password = await hashPassword(userDto.password);
    if (manager) {
      const user = manager.create(User, { ...userDto, password });
      await manager.save(user);
      return user;
    }
    
    return await this.userRepo.create({ ...userDto, password });
  }
}
