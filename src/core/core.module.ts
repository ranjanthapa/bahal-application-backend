import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { JwtAuthModule } from './jwt-auth/jwt-auth.module';

@Module({
  imports: [DatabaseModule, JwtAuthModule]
})
export class CoreModule {}
