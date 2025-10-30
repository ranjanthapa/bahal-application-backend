import z from 'zod';

export const nepaliPhoneNumber = z.string().regex(/^(\+977)?(98|97)\d{8}$/, {
  message: 'Invalid number, must be a valid Nepali mobile number',
});

export const ContactNumberSchema = z.object({
  primaryNumber: nepaliPhoneNumber,
  secondaryNumber: nepaliPhoneNumber.optional(),
});

export const UpdateContactNumberSchema = ContactNumberSchema.partial()

