import { z } from 'zod';
import { RenterStatus } from '../enums/renter-status.enum';
import {
  ContactNumberSchema,
  UpdateContactNumberSchema,
} from './contact-number.schema';
import { RenterDocumentSchema } from './renter-document.schema';

export const RenterSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: 'Full name must be at least 3 characters long' })
    .max(250),

  joinedOn: z.coerce.date({
    required_error: 'Joined date is required',
    invalid_type_error: 'Invalid date format',
  }),

  contactNumbers: ContactNumberSchema,

  picture: z.string().optional(),

  documents: RenterDocumentSchema,

  status: z.nativeEnum(RenterStatus).default(RenterStatus.ACTIVE),

  numberOfRooms: z
    .number({
      required_error: 'Number of rooms is required',
    })
    .int()
    .positive({ message: 'Number of rooms must be greater than 0' }),
});

export const UpdateRenterSchema = RenterSchema.extend({
  contactNumbers: UpdateContactNumberSchema.optional(),
}).partial();

export type RenterDTO = z.infer<typeof RenterSchema>;
export type UpdateRenterDTO = z.infer<typeof UpdateRenterSchema>;
