import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppLoggerModule } from '../app-logger/app-logger.module';

import { CacheService } from './cache.service';

@Module({
  imports: [ConfigModule, AppLoggerModule],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
