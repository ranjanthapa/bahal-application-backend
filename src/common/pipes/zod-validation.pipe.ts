import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common';
import { ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException({
        message:
          'Your request couldn’t be processed. Please ensure all required information is correct and try again.',
        detailedMessage: fromZodError(result.error).toString(),
        statusCode: 400,
        error: 'Bad Request',
      });
    }
    return result.data;
  }
}
