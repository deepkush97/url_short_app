import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Redis from 'ioredis';

import { AppLoggerService } from '../app-logger/app-logger.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: AppLoggerService,
    private readonly redisService: RedisService,
  ) {
    this.redisClient = this.redisService.getClient();
  }

  onModuleInit(): void {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);

    this.redisClient = new Redis({
      host,
      port,
    });

    this.logger.info(`Connected to Redis at ${host}:${port}`);
  }

  onModuleDestroy(): void {
    void this.redisClient.quit();
  }

  async get<T>(key: string): Promise<T | null> {
    this.logger.info(`get: key ${key}`);
    const value = await this.redisClient.get(key);
    if (!value) {
      this.logger.info(`get: cache missed ${key}`);
      return null;
    }
    this.logger.info(`get: cache success ${key}`);
    return JSON.parse(value) as T;
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    this.logger.info(`set: key ${key} ttl ${ttl}`);

    if (ttl) {
      this.logger.info(`set: cache set ${key} with ttl ${ttl}`);
      await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
    } else {
      this.logger.info(`set: cache set ${key}`);
      await this.redisClient.set(key, JSON.stringify(value));
    }
  }

  async del(key: string): Promise<void> {
    this.logger.info(`del: key ${key}`);

    await this.redisClient.del(key);
  }

  async delAll(pattern: string, batchSize = 1): Promise<void> {
    this.logger.info(`delAll: pattern ${pattern} batchSize ${batchSize}`);

    const stream = this.redisClient.scanStream({
      match: pattern,
      count: batchSize,
    });

    let pipeline = this.redisClient.pipeline();
    let localKeys = [];
    const count = 0;

    stream.on('data', (resultKeys) => {
      this.logger.info(`delAll: keys found ${resultKeys.length} count ${count}`);
      for (const resultKey of resultKeys) {
        localKeys.push(resultKey);
        pipeline.del(resultKey);
      }

      if (localKeys.length > batchSize) {
        void pipeline.exec((error, result) => {
          if (error) this.logger.error('error in executing pipeline', { error });
          if (result) this.logger.info('batch completed', { data: result });
        });
        localKeys = [];
        pipeline = this.redisClient.pipeline();
      }
    });

    stream.on('end', () => {
      void pipeline.exec((error, result) => {
        if (error) this.logger.error('error in executing pipeline', { error });
        if (result) this.logger.info('batch completed', { data: result });
      });
    });

    stream.on('error', (error) => {
      if (error) this.logger.error('error in executing pipeline', { error });
    });
  }
}
