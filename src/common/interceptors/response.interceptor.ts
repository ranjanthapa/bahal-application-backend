import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable, EMPTY } from 'rxjs';
import { SKIP_GLOBAL_INTERCEPTORS } from '../decorators/skip-global.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skip = this.reflector.get<boolean>(
      SKIP_GLOBAL_INTERCEPTORS,
      context.getHandler(),
    );

    if (skip){
      return next.handle();
    }
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => ({
        status: true,
        statusCode: res.statusCode,
        message: data?.message || 'Success',
        data,
      })),
      catchError((err) => {
        res.status(err.status || 500).json({
          status: false,
          statusCode: err.status || 500,
          message: err.message || 'Internal server error',
        });
        return EMPTY;
      }),
    );
  }
}
