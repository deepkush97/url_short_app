import { Injectable, Scope } from '@nestjs/common';

import { Logger as TypeOrmLogger } from 'typeorm';

import { AppLoggerService } from './app-logger.service';

@Injectable({ scope: Scope.TRANSIENT })
export class DatabaseLogger implements TypeOrmLogger {
  constructor(private readonly logger: AppLoggerService) {}

  logQuery(query: string, parameters?: unknown[]): void {
    this.logger.info('[QUERY]', { query, parameters });
  }

  logQueryError(error: string, query: string, parameters?: unknown[]): void {
    this.logger.error('[QUERY_FAILED]', { error, query, parameters });
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[]): void {
    this.logger.warn('[SLOW_QUERY_DETECTION]', {
      executionTime: time,
      query,
      parameters,
    });
  }

  logSchemaBuild(message: string): void {
    this.logger.info(message);
  }

  logMigration(message: string): void {
    this.logger.info(message);
  }

  log(level: 'log' | 'info' | 'warn', message: string): void {
    if (level === 'warn') this.logger.warn(message);
    else this.logger.info(message);
  }
}
