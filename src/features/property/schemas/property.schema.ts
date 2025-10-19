import z from 'zod';
import Decimal from 'decimal.js';

const validateAmount = (val: string | null | undefined): boolean => {
  if (!val || val.trim() === '') return false;

  try {
    const dec = new Decimal(val);
    return dec.dp() <= 2 && dec.precision(true) <= 10;
  } catch {
    return false;
  }
};

const transformToDecimal = (val: string): string => new Decimal(val).toString();

export const PropertySchema = z.object({
  name: z.string().max(50),
  rentPerRoom: z
    .string()
    .refine(validateAmount, {
      message:
        'Amount must be a valid decimal with max precision 10 and scale 2',
    })
    .transform(transformToDecimal),
  waterRate: z
    .string()
    .refine(validateAmount, {
      message:
        'Amount must be a valid decimal with max precision 10 and scale 2',
    })
    .transform(transformToDecimal),
  electricityRate: z
    .string()
    .refine(validateAmount, {
      message:
        'Amount must be a valid decimal with max precision 10 and scale 2',
    })
    .transform(transformToDecimal),
  picture: z.string().nullable().optional(),
  numberOfFloor: z.number().int().positive(),
  roomsPerFloor: z.number().int().positive(),
});

export type PropertyDTO = z.infer<typeof PropertySchema>;
