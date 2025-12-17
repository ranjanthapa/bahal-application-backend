import z from 'zod';

export const ElectricitySchema = z.object({
  meterName: z.string().min(3).max(40),
  previouseMonthUnit: z.coerce.number().nonnegative(),
  previousUnitDate: z.coerce.date(),
});

export type CreateElectricityMeterDTO = z.infer<typeof ElectricitySchema>;
