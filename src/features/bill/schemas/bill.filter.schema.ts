import z from 'zod';
import { BillStatus } from '../enums/bill-status.enum';
import { paginationSchema } from 'src/common/schemas/pagination.schema';

export const billFilterSchema = paginationSchema.extend({
  status: z.nativeEnum(BillStatus).optional(),
  billingDateFrom: z.coerce.date().optional(),
  billingDateTo: z.coerce.date().optional(),
});

export type BillFilterDTO = z.infer<typeof billFilterSchema>;
