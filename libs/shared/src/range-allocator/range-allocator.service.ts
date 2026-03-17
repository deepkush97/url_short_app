import { Injectable } from '@nestjs/common';

import Redis from 'ioredis';

import { AppLoggerService } from '../app-logger/app-logger.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RangeAllocatorService {
  private redis: Redis;
  private currentId = 0;
  private maxId = 0;
  private readonly WINDOW_RANGE = 1000;
  private readonly INCREMENT_KEY = 'global:next_id_range';

  constructor(
    private readonly redisService: RedisService,
    private readonly logger: AppLoggerService,
  ) {
    this.redis = this.redisService.getClient();
  }

  async getNextId(): Promise<number> {
    if (this.currentId >= this.maxId) {
      await this.getNewRange();
    }
    this.logger.info(`Current Id: ${this.currentId}`);
    const id = this.currentId++;
    this.logger.info(`Id: ${id}`);
    return id;
  }

  private async getNewRange(): Promise<void> {
    this.logger.info('Creating new range', {
      data: {
        currentId: this.currentId,
        maxId: this.maxId,
      },
      context: RangeAllocatorService.name,
    });
    try {
      const newRange = await this.redis.incrby(this.INCREMENT_KEY, this.WINDOW_RANGE);
      this.currentId = newRange - this.WINDOW_RANGE;
      this.maxId = newRange;
    } catch (error) {
      this.logger.error('Failed to allocate new range', {
        data: {
          currentId: this.currentId,
          maxId: this.maxId,
        },
        error,
        context: RangeAllocatorService.name,
      });
    }
  }
}
