import { Module } from '@nestjs/common';
import { PaymentService } from './services/payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentController } from './controllers/payment.controller';
import { Bill } from '../bill/entities/bill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Bill])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
