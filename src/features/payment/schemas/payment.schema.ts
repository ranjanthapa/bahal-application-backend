import z from 'zod';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentType } from '../enums/payment-type.enum';

export const PaymentSchema = z.object({
  receivedAmount: z.coerce.number().positive(),
  method: z.nativeEnum(PaymentMethod),
  type: z.nativeEnum(PaymentType),
  note: z.string().max(250).nullable(),
});

export type PaymentDTO = z.infer<typeof PaymentSchema>;
