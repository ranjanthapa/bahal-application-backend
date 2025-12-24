import z from 'zod';

export const ElectricitySchema = z.object({
  meterName: z.string().min(3).max(40),
  previousMonthUnit: z.coerce.number().nonnegative(),
  previousUnitDate: z.coerce.date(),
});

export const UpdateElectricityMeterSchema = ElectricitySchema.pick({
  meterName: true,
});

export type CreateElectricityMeterDTO = z.infer<typeof ElectricitySchema>;
export type UpdateElectricityMeterDTO = z.infer<
  typeof UpdateElectricityMeterSchema
>;
