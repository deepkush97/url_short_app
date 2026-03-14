import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CacheModule } from '@app/shared/cache/cache.module';

import { UserModule } from '../user/user.module';

import { Session } from './entities/session.entity';

import { SessionService } from './session.service';

@Module({
  imports: [TypeOrmModule.forFeature([Session]), CacheModule, UserModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
