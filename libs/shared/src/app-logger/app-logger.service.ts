import { Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';

import { Params, PARAMS_PROVIDER_TOKEN, PinoLogger } from 'nestjs-pino';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerService extends PinoLogger {
  constructor(
    @Inject(PARAMS_PROVIDER_TOKEN) params: Params,
    @Inject(INQUIRER) private parent: object,
  ) {
    super(params);

    const context = parent?.constructor?.name || 'App';
    this.setContext(context);
  }
}
