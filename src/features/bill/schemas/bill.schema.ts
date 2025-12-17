import z from 'zod';
import { BillStatus } from '../enums/bill-status.enum';

export const BillSchema = z.object({
  electricityUnits: z.coerce.number().nonnegative(),
  billingMonth: z.coerce.date(),
  note: z.string().min(3).max(250).optional(),
  status: z.nativeEnum(BillStatus),
  otherCharges: z
    .array(
      z.object({
        title: z.string().min(1).max(30),
        amount: z.coerce.number().positive(),
      }),
    )
    .optional(),
});

export const UpdateBillSchema = BillSchema.partial();

export type BillDTO = z.infer<typeof BillSchema>;
export type UpdateBillDto = z.infer<typeof UpdateBillSchema>;

