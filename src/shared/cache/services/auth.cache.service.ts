import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from '../cache.constants';
import Redis from 'ioredis';

@Injectable()
export class AuthCacheService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async setOTP(email: string, otp: string): Promise<void> {
    try {
      const TTL = 5 * 60;
      const key = `otp:${email}`;
      await this.redis.set(key, otp, 'EX', TTL);
    } catch (error) {
      throw error;
    }
  }

  async getOTP(email: string): Promise<string | null> {
    try {
      return this.redis.get(`otp:${email}`);
    } catch (error) {
      throw error;
    }
  }

  async deleteOtp(email: string): Promise<void> {
    try {
      await this.redis.del(`otp:${email}`);
    } catch (error) {
      throw error;
    }
  }
}
