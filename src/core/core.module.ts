import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { JwtAuthModule } from './jwt-auth/jwt-auth.module';
import { GuardModule } from './guard/guard.module';

@Module({
  imports: [DatabaseModule, GuardModule, JwtAuthModule],
})
export class CoreModule {}
