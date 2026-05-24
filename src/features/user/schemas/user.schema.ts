import { z } from 'zod';

import { createZodDto } from 'nestjs-zod';

export const UserSchema = z.object({
  firstName: z.string().max(20),
  middleName: z.string().max(20).optional(),
  lastName: z.string().max(20),
  email: z.string().email().optional(),
  phoneNumber: z.string().regex(/^(\+977)?(98|97)\d{8}$/, {
    message: 'Invalid number, required valid nepali number',
  }).optional(),
  avatar: z.string().optional(),
  password: z.string(),
});

// export type CreateUserDTO = z.infer<typeof UserSchema>;

export class CreateUserDto extends createZodDto(UserSchema) {}
