import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { Observable, of } from 'rxjs';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';
import { CacheService } from '@app/shared/cache/cache.service';

@Injectable()
export class CacheRedirectInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheService: CacheService,
    private readonly adapterHost: HttpAdapterHost,
    private readonly logger: AppLoggerService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    this.logger.info('Started intercept', { context: CacheRedirectInterceptor.name });
    const http = context.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();

    const code = request.params.code;

    if (code) {
      this.logger.debug('Got code', { data: { code }, context: CacheRedirectInterceptor.name });

      const urlData = await this.cacheService.get<{ url: string }>(code);

      this.logger.debug('CachedUrl', { data: { urlData }, context: CacheRedirectInterceptor.name });

      const cachedUrl = urlData?.url;

      if (cachedUrl) {
        const { httpAdapter } = this.adapterHost;
        this.logger.debug('Redirecting ...', { context: CacheRedirectInterceptor.name });
        httpAdapter.redirect(response, 302, cachedUrl);
        return of(null);
      }
    }

    this.logger.debug('Fail to get cache', {
      data: { code },
      context: CacheRedirectInterceptor.name,
    });

    return next.handle();
  }
}
