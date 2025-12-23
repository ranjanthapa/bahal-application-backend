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
import { BillPaymentsSummary } from '../interfaces/bill-payment-summary';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Bill) private readonly billRepo: Repository<Bill>,
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

      if (bill.paymentStatus === PaymentStatus.FULLYPAID) {
        throw new UnprocessableEntityException(
          'Cannot make payment. Bill is already fully paid.',
        );
      }

      const { receivedAmount, ...otherField } = paymentDTO;

      const billPaymentsSummary = await this.getBillPaymentsSummary(billId);
      console.log(billPaymentsSummary);
      const parsedReceivedAmount = new Decimal(receivedAmount);
      const overOrEqualPayment = parsedReceivedAmount.greaterThanOrEqualTo(
        billPaymentsSummary.dueAmount,
      ); 
      const returnAmount = overOrEqualPayment
        ? parsedReceivedAmount
            .plus(billPaymentsSummary.totalReceived)
            .minus(billPaymentsSummary.totalAmount)
        : new Decimal(0);

      const payment = manager.create(Payment, {
        ...otherField,
        receivedAmount: parsedReceivedAmount.toFixed(2),
        returnAmount: returnAmount.toFixed(2),
        bill: { id: billId },
      });

      await manager.save(payment);

      if (overOrEqualPayment) {
        bill.paymentStatus = PaymentStatus.FULLYPAID;
      } else {
        bill.paymentStatus = PaymentStatus.PARTIAL;
      }

      await manager.save(bill);
      return payment;
    });
  }

  async getBillPaymentsSummary(billId: string): Promise<BillPaymentsSummary> {
    const paymentsSummary = await this.billRepo
      .createQueryBuilder('b')
      .select('b.id', 'billId')
      .addSelect('b.totalAmount', 'totalAmount')
      .addSelect(
        'COALESCE(SUM(p.received_amount - COALESCE(p.return_amount, 0)), 0)',
        'totalReceived',
      )
      .leftJoin('payment', 'p', 'p.bill_id = b.id')
      .where('b.id = :billId', { billId })
      .groupBy('b.id')
      .addGroupBy('b.totalAmount')
      .getRawOne();

    return {
      ...paymentsSummary,
      dueAmount: Decimal(paymentsSummary.totalAmount)
        .minus(Decimal(paymentsSummary.totalReceived))
        .toFixed(2),
    };
  }
}
