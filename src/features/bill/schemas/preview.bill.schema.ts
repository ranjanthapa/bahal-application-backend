import z from 'zod';
import { BillStatus } from '../enums/bill-status.enum';

export const BillPreviewSchema = z.object({
  totalAmount: z.string(),
  totalRoomRent: z.string(),
  electricityChargePerUnit: z.string(),
  totalElectricityCharge: z.string(),
  electricityUnits: z.string(),
  electricityConsumed: z.string(),
  billingDate: z.coerce.date(),
  waterCharge: z.string(),
  note: z.string().nullable(),
  status: z.nativeEnum(BillStatus),
  otherCharges: z
    .array(
      z.object({
        title: z.string().min(1).max(30),
        amount: z.coerce.number().positive(),
      }),
    )
    .nullable(),
  renter: z.string(),
  owner: z.string(),
  electricitymeterId: z.string(),
});

export type BillPreviewDTO = z.infer<typeof BillPreviewSchema>;
