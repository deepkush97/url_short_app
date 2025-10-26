import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';
import { appCodeToStatusMap } from './app-code-to-status.map';
import { AppCodes } from './app-codes.enum';

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((res) => {
        if (!res?.code) {
          console.error('no AppResponse');
        }
        const code = res?.code || AppCodes.INTERNAL_ERROR;
        const status = appCodeToStatusMap[code] || 500;

        response.status(status);

        return {
          code,
          ...(res?.data ? { data: res.data } : {}),
        };
      }),
    );
  }
}
