import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable, EMPTY } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
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
