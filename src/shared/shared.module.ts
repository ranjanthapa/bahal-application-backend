import { Module } from '@nestjs/common';
import { CacheModule } from './cache/cache.module';
import { EmailModule } from './email/email.module';

@Module({
    imports: [CacheModule, EmailModule]
})
export class SharedModule {}
