import z from 'zod';

export const RenterPricingSchema = z.object({
  rentPerRoom: z.coerce.number().positive().transform(String),
  waterRate: z.coerce.number().nonnegative().transform(String),
  electricityRate: z.coerce.number().nonnegative().transform(String),
});

export type RenterPricingDTO = z.infer<typeof RenterPricingSchema>;
