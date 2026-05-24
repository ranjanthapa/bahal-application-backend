import { z } from 'zod';

import { createZodDto } from 'nestjs-zod';

export const UserSchema = z.object({
  email: z.string().email(),
  otp: z.string(),
});

// export type CreateUserDTO = z.infer<typeof UserSchema>;

export class CreateUserDto extends createZodDto(UserSchema) {}
