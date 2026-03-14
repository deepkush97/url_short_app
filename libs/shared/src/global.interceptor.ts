import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { Request, Response } from 'express';
import { map, Observable, tap } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { AppLoggerService } from './app-logger/app-logger.service';

import { appCodeToStatusMap } from './app-code-to-status.map';
import { AppCodes } from './app-codes.enum';
import { AppResponse } from './app-response.dto';

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const id = request['requestId'] || request.headers['x-request-id'] || uuid();

    response.setHeader('x-request-id', id.toString());

    const { method, originalUrl } = request;
    const start = Date.now();

    return next.handle().pipe(
      map((res) => {
        if (!(res instanceof AppResponse)) {
          this.logger.error(`[${id}] received is not an instance of AppResponse`);
        }
        const code = res?.code || AppCodes.INTERNAL_ERROR;
        const status = appCodeToStatusMap[code] ?? 500;

        response.status(status);

        return {
          code,
          ...(res?.data ? { data: res.data } : {}),
        };
      }),
      tap(() => {
        const duration = Date.now() - start;
        const status = response.statusCode;

        this.logger.info(`${method} ${originalUrl} -> ${status} (${duration}ms)`);
      }),
    );
  }
}
