import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async isUserExist({
    email,
    phoneNumber,
  }: {
    email?: string;
    phoneNumber?: string;
  }): Promise<boolean> {
    const user = await this.repo.findOne({
      where: [{ email }, { phoneNumber }],
    });
    return !!user;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return await this.repo.findOne({ where: { phoneNumber: phoneNumber } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repo.findOne({ where: { email: email } });
  }

  async create(data: CreateUserDto): Promise<User> {
    const user = this.repo.create(data);
    return await this.repo.save(user);
  }

  async updateByEmail(email: string, data: Partial<User>) {
    return await this.repo.update({ email }, data);
  }
}
