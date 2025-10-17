import { z } from 'zod';

export const LoginSchema = z.object({
  identifier: z.string().transform((value) => {
    const isEmail = /^\S+@\S+\.\S+$/.test(value);
    if (isEmail) return { isEmail: true, value };
    const isNepaliPhone = /^(\+977)?(98|97)\d{8}$/.test(value);
    if (isNepaliPhone) return { isPhoneNumber: true, value };
  }),
  password: z.string(),
});

export type LoginDTO = z.infer<typeof LoginSchema>;
