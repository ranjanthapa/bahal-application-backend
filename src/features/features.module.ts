import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PropertyModule } from './property/property.module';
import { RenterModule } from './renter/renter.module';
import { BillModule } from './bill/bill.module';

@Module({
  imports: [UserModule, AuthModule, PropertyModule, RenterModule, BillModule]
})
export class FeaturesModule {}
