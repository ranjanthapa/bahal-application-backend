import { z } from 'zod';

import { createZodDto } from 'nestjs-zod';

export const verifyOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string(),
});


export class VerifyOTPDto extends createZodDto(verifyOTPSchema) {}
