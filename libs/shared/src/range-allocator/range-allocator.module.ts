import { Module } from '@nestjs/common';

import { RedisModule } from '../redis/redis.module';

import { RangeAllocatorService } from './range-allocator.service';

@Module({
  imports: [RedisModule],
  providers: [RangeAllocatorService],
  exports: [RangeAllocatorService],
})
export class RangeAllocatorModule {}
