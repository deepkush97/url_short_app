import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Redis from 'ioredis';

import { AppLoggerService } from '../app-logger/app-logger.service';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: AppLoggerService,
  ) {}

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
    this.logger.info(`Bye bye, Redis is getting disconnect`);
    void this.redisClient.quit();
  }

  public getClient(): Redis {
    return this.redisClient;
  }
}
