import {
  BadRequestException,
  Injectable,
  ParseUUIDPipe,
  PipeTransform,
} from '@nestjs/common';
import { PROPERTY_ERROR_MESSAGE } from '../constants/error-message.constants';

@Injectable()
export class UUIDValidationPipe extends ParseUUIDPipe implements PipeTransform {
  constructor() {
    super({
      exceptionFactory: () =>
        new BadRequestException(PROPERTY_ERROR_MESSAGE.INVALID_ID),
    });
  }
}
