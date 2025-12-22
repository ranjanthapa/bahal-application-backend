import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Bill } from 'src/features/bill/entities/bill.entity';
import { BillStatus } from 'src/features/bill/enums/bill-status.enum';
import { DataSource, Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { PaymentDTO } from '../schemas/payment.schema';
import Decimal from 'decimal.js';
import { PaymentStatus } from '../enums/payment-status.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async makePayment(billId: string, paymentDTO: PaymentDTO) {
    return await this.dataSource.transaction(async (manager) => {
      const bill = await manager.findOne(Bill, { where: { id: billId } });
      if (!bill) {
        throw new NotFoundException('Bill not found');
      }

      if (bill.status != BillStatus.FINALIZED) {
        throw new UnprocessableEntityException(
          'Only finalized bill can have payment',
        );
      }

      const { receivedAmount, ...otherField } = paymentDTO;
      const parsedReceivedAmount = new Decimal(paymentDTO.receivedAmount);
      const overPayment = parsedReceivedAmount.greaterThan(bill.totalAmount);
      const returnAmount = overPayment
        ? parsedReceivedAmount.minus(bill.totalAmount)
        : Decimal(0);

      const payment = manager.create(Payment, {
        ...otherField,
        receivedAmount: parsedReceivedAmount.toFixed(2),
        returnAmount: returnAmount.toFixed(2),
        bill: { id: billId },
      });

      await manager.save(payment);
      if (overPayment) {
        bill.paymentStatus = PaymentStatus.FULLYPAID;
      } else {
        bill.paymentStatus = PaymentStatus.PARTIAL;
      }

      await manager.save(bill);
      return payment;
    });
  }
}
