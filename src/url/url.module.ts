import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Base62Module } from '@app/shared/base62/base62.module';
import { CacheModule } from '@app/shared/cache/cache.module';
import { AppMetricsModule } from '@app/shared/metrics/metrics.module';
import { RangeAllocatorModule } from '@app/shared/range-allocator/range-allocator.module';

import { Url } from './entities/url.entity';

import { UrlController } from './url.controller';
import { UrlService } from './url.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Url]),
    Base62Module,
    CacheModule,
    RangeAllocatorModule,
    AppMetricsModule,
  ],
  providers: [UrlService],
  controllers: [UrlController],
})
export class UrlModule {}
