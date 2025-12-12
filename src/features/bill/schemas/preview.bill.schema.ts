import z from 'zod';
import { BillStatus } from '../enums/bill-status.enum';

export const BillPreviewSchema = z.object({
  totalAmount: z.string(),
  totalRoomRent: z.string(),
  electricityAmountPerUnit: z.string(),
  totalElectricityAmount: z.string(),
  totalElectricityConsumed: z.string(),
  billingDate: z.coerce.date(),
  waterAmount: z.string(),
  note: z.string().nullable(),
  status: z.nativeEnum(BillStatus),
  otherCharges: z
    .array(
      z.object({
        title: z.string().min(1).max(30),
        amount: z.coerce.number().positive(),
      }),
    )
    .optional(),
  renter: z.string(),
  owner: z.string(),
});

export type BillPreviewDTO = z.infer<typeof BillPreviewSchema>;
