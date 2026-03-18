import { Provider } from '@nestjs/common';

import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

import { MetricLabel, MetricName } from './metrics.constant';

export const providers: Provider[] = [
  makeCounterProvider({
    name: MetricName.REDIRECT_TOTAL,
    labelNames: [MetricLabel.SOURCE, MetricLabel.STATUS] as const,
    help: 'Url redirect counter',
  }),
];
