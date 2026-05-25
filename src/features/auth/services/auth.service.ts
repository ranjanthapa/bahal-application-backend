import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { User } from 'src/features/user/entities/user.entity';
import { UserRepository } from 'src/features/user/repository/user.repository';
import { CreateUserDto } from 'src/features/user/schemas/user.schema';
import { UserService } from 'src/features/user/services/user.service';
import { AuthCacheService } from 'src/shared/cache/services/auth.cache.service';
import { EmailService } from 'src/shared/email/services/email.service';
import { DataSource } from 'typeorm';
import { comparePassword } from '../utils/hash.util';
import { VerifyOTPDto } from '../schemas/verify-otp.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepository,
    private readonly emailService: EmailService,
    private readonly authCache: AuthCacheService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async register(userDto: CreateUserDto) {
    const otp = this.generateOtp();
    let otpStored = false;

    try {
      await this.dataSource.transaction(async (manager) => {
        const user = await this.userService.create(userDto, manager);

        await this.authCache.setOTP(user.email, otp);
        otpStored = true;

        await this.emailService.sendOtp(user.email, user.firstName, otp);
      });
    } catch (error) {
      if (otpStored) {
        await this.authCache.deleteOtp(userDto.email!);
      }
      throw error;
    }
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async verifyOtp(data: VerifyOTPDto) {
    const { email, otp } = data;
    const storedOtp = await this.authCache.getOTP(email);
    if (!storedOtp) {
      throw new BadRequestException(
        'OTP expired or not found, please request a new one',
      );
    }
    const isValid = otp === storedOtp;
    if (!isValid) {
      throw new BadRequestException('Invalid otp');
    }

    await this.authCache.deleteOtp(email);
    await this.userService.update(email, { isVerify: true } as Partial<User>);
    return { message: 'OTP verified successfully' };
  }

  async validateUser(
    phoneNumber: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepo.findByPhoneNumber(phoneNumber);
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
