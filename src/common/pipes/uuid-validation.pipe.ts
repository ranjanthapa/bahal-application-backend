import {
  BadRequestException,
  Injectable,
  ParseUUIDPipe,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class UUIDValidationPipe extends ParseUUIDPipe implements PipeTransform {
  constructor(message = "Invalid Id") {
    super({
      exceptionFactory: () => new BadRequestException(message),
    });
  }
}
