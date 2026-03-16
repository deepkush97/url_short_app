import { Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';

import { PinoLogger } from 'nestjs-pino';
import { Level } from 'pino';

type AppLogPayload = {
  data?: unknown;
  error?: Error | unknown;
};

@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerService {
  constructor(
    private readonly logger: PinoLogger,
    @Inject(INQUIRER) private parent: object,
  ) {
    const context = parent?.constructor?.name || 'App';
    this.logger.setContext(context);
  }

  private log(type: Level, msg: string, payload?: AppLogPayload): void {
    if (!payload) {
      this.logger[type](msg);
    }
    this.logger[type](payload, msg);
  }

  fatal(msg: string, payload?: AppLogPayload): void {
    this.log('fatal', msg, payload);
  }

  error(msg: string, payload?: AppLogPayload): void {
    this.log('error', msg, payload);
  }
  warn(msg: string, payload?: AppLogPayload): void {
    this.log('warn', msg, payload);
  }
  info(msg: string, payload?: AppLogPayload): void {
    this.log('info', msg, payload);
  }
  debug(msg: string, payload?: AppLogPayload): void {
    this.log('debug', msg, payload);
  }
  trace(msg: string, payload?: AppLogPayload): void {
    this.log('trace', msg, payload);
  }
}
