import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, map, tap } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { appCodeToStatusMap } from './app-code-to-status.map';
import { AppCodes } from './app-codes.enum';

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  private readonly logger = new Logger('GlobalInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const requestId = request.headers['x-request-id'] || uuid();
    request['requestId'] = requestId;
    response.setHeader('x-request-id', requestId);

    const { method, originalUrl } = request;
    const start = Date.now();

    return next.handle().pipe(
      map((res) => {
        if (!res?.code) {
          this.logger.error(`[${requestId}] Missing AppResponse`);
        }
        const code = res?.code || AppCodes.INTERNAL_ERROR;
        const status = appCodeToStatusMap[code] || 500;

        response.status(status);

        return {
          code,
          ...(res?.data ? { data: res.data } : {}),
        };
      }),
      tap(() => {
        const duration = Date.now() - start;
        const status = response.statusCode;

        this.logger.log(
          `[${requestId}] ${method} ${originalUrl} -> ${status} (${duration}ms)`,
        );
      }),
    );
  }
}
