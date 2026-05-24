import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { REDIS_CLIENT } from './cache.constants';
import Redis from 'ioredis';
import { AuthCacheService } from './services/auth.cache.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        });
      },
      inject: [ConfigService],
    },
    AuthCacheService,
  ],
  exports: [AuthCacheService],
})
export class CacheModule {}
