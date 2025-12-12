import { Query } from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { ZodSchema } from 'zod';

export function ZodQuery(schema: ZodSchema) {
  return Query(new ZodValidationPipe(schema));
}
