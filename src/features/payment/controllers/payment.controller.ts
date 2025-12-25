import { Controller, Get, Param, Post } from '@nestjs/common';
import { ZodBody } from 'src/common/decorators/zod-body.decorator';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';
import { PaymentDTO, PaymentSchema } from '../schemas/payment.schema';
import { PaymentService } from '../services/payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/bills/:id/payments')
  async create(
    @Param('id', UUIDValidationPipe)
    billId: string,
    @ZodBody(PaymentSchema) paymentDTO: PaymentDTO,
  ) {
    return await this.paymentService.makePayment(billId, paymentDTO);
  }

  @Get('/bills/:id/payment-summary')
  async getSummary(
    @Param('id', UUIDValidationPipe)
    billId: string,
  ) {
    return await this.paymentService.getBillPaymentsSummary(billId);
  }

  @Get('/bills/:id/payments')
  async billPayments(
    @Param('id', UUIDValidationPipe)
    billId: string,
  ) {
    return await this.paymentService.getPaymentsByBillId(billId);
  }
}
