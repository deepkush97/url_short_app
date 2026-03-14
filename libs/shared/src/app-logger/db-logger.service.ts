import { Injectable } from '@nestjs/common';

import { Logger as TypeOrmLogger } from 'typeorm';

import { AppLoggerService } from './app-logger.service';
function stringifyParams(parameters: string[]): string {
  try {
    return JSON.stringify(parameters);
  } catch {
    return parameters?.join(', ');
  }
}
@Injectable()
export class DatabaseLoggerService implements TypeOrmLogger {
  constructor(private readonly logger: AppLoggerService) {}

  logQuery = (query: string, parameters?: string[]): void => {
    const sql = `${query} ${parameters?.length ? ` -- PARAMETERS: ${stringifyParams(parameters)}` : ''}`;
    this.logger.debug(sql);
  };

  logQueryError = (error: string, query: string, parameters?: string[]): void => {
    const sql = `${query} ${parameters?.length ? ` -- PARAMETERS: ${stringifyParams(parameters)}` : ''} -- ERROR: ${error}`;
    this.logger.error(sql);
  };

  logQuerySlow = (time: number, query: string, parameters?: string[]): void => {
    const sql = `${query} ${parameters?.length ? ` -- PARAMETERS: ${stringifyParams(parameters)}` : ''} -- TIME: ${time}`;
    this.logger.warn(sql);
  };

  logSchemaBuild = (message: string): void => {
    this.logger.debug(message);
  };

  logMigration = (message: string): void => {
    this.logger.debug(message);
  };

  log = (level: 'log' | 'info' | 'warn', message: string): void => {
    if (level === 'warn') this.logger.warn(message);
    else this.logger.info(message);
  };
}
