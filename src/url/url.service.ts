import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { Repository } from 'typeorm';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';
import { Base62Service } from '@app/shared/base62/base62.service';
import { CacheService } from '@app/shared/cache/cache.service';
import { INewUrl, IUrl } from '@app/shared/interfaces/url/url.interface';
import {
  MetricDataSource,
  MetricLabel,
  MetricName,
  MetricStatus,
} from '@app/shared/metrics/metrics.constant';
import { RangeAllocatorService } from '@app/shared/range-allocator/range-allocator.service';

import { Url } from './entities/url.entity';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    private readonly cacheService: CacheService,
    private readonly rangeAllocatorService: RangeAllocatorService,
    private readonly base62Service: Base62Service,
    private readonly logger: AppLoggerService,
    @InjectMetric(MetricName.REDIRECT_TOTAL)
    private readonly counter: Counter<MetricLabel>,
  ) {}

  async createUrl(input: INewUrl, userId: number): Promise<Url> {
    const newId = await this.rangeAllocatorService.getNextId();
    const code = this.base62Service.encode(newId);

    const newUrl: Partial<IUrl> = {
      ...input,
      userId,
      code,
    };

    const url = this.urlRepository.create(newUrl);
    const urlData = await this.urlRepository.save(url);

    await this.cacheService.set(code, { url: input.url });

    return urlData;
  }

  async getUrlByCode(code: string): Promise<string | null> {
    const existingUrl = await this.urlRepository.findOne({ where: { code } });
    if (!existingUrl) {
      this.counter.inc({
        [MetricLabel.SOURCE]: MetricDataSource.DATABASE,
        [MetricLabel.STATUS]: MetricStatus.FAIL,
      });
      return null;
    }

    await this.cacheService.set(code, { url: existingUrl.url });
    this.counter.inc({
      [MetricLabel.SOURCE]: MetricDataSource.DATABASE,
      [MetricLabel.STATUS]: MetricStatus.SUCCESS,
    });
    return existingUrl.url;
  }
}
