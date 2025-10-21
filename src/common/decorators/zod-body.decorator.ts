import { Body } from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { ZodSchema } from 'zod';

export function ZodBody(schema: ZodSchema) {
  return Body(new ZodValidationPipe(schema));
}
