import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PropertyModule } from './property/property.module';
import { RenterModule } from './renter/renter.module';
import { BillModule } from './bill/bill.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [UserModule, AuthModule, PropertyModule, RenterModule, BillModule, PaymentModule]
})
export class FeaturesModule {}
