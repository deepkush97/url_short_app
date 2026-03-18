import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { Repository } from 'typeorm';

import { CACHE_TTL_IN_SECONDS } from '@app/app.constant';
import { CacheService } from '@app/shared/cache/cache.service';
import { AuthSessionEnum } from '@app/shared/enums/auth-session.enum';
import { ISession } from '@app/shared/interfaces/session/session.interface';
import { ICurrentUser, IUser } from '@app/shared/interfaces/user/users.interface';
import { MetricLabel, MetricName, MetricStatus } from '@app/shared/metrics/metrics.constant';
import { UsersService } from '@app/user/user.service';

import { Session } from './entities/session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly userService: UsersService,
    private readonly cacheService: CacheService,
    @InjectMetric(MetricName.SESSION_TOTAL)
    private readonly counter: Counter<MetricLabel>,
  ) {}

  async createNewSession(user: IUser): Promise<ICurrentUser> {
    const newSession = this.sessionRepository.create({
      userId: user.id,
      status: AuthSessionEnum.OPEN,
    });
    const session = await this.sessionRepository.save(newSession);
    this.counter.inc({
      [MetricLabel.STATUS]: MetricStatus.OPEN,
    });
    return this.prepareSessionPayload(session, user);
  }

  async findSessionByGuid(sessionId: string): Promise<ICurrentUser | null> {
    const cachedSession = await this.cacheService.get<ICurrentUser>(sessionId);
    if (cachedSession) {
      return cachedSession;
    }

    const session = await this.findOneByGuid(sessionId);
    if (!session || session.status === AuthSessionEnum.CLOSED) {
      return null;
    }

    const user = await this.userService.findOneById(session.userId);

    return this.prepareSessionPayload(session, user);
  }

  private async prepareSessionPayload(session: ISession, user: IUser): Promise<ICurrentUser> {
    const sessionId = session.guid;

    const { password: _, updatedAt: __, ...rest } = user;
    const sessionPayload = { ...rest, sessionId };
    await this.cacheService.set(sessionId, sessionPayload, CACHE_TTL_IN_SECONDS);
    return sessionPayload;
  }

  private async findOneByGuid(guid: string): Promise<ISession | null> {
    return this.sessionRepository.findOne({ where: { guid } });
  }

  async closeAllSession(userId: number): Promise<boolean> {
    const result = await this.sessionRepository.update(
      { userId, status: AuthSessionEnum.OPEN },
      { status: AuthSessionEnum.CLOSED },
    );

    if (result.affected > 0) {
      this.counter.inc({
        [MetricLabel.STATUS]: MetricStatus.CLOSED,
      });
    }

    return true;
  }

  async closeSession(guid: string): Promise<boolean> {
    await Promise.all([
      this.sessionRepository.update({ guid }, { status: AuthSessionEnum.CLOSED }),
      this.cacheService.del(guid),
    ]);
    this.counter.inc({
      [MetricLabel.STATUS]: MetricStatus.CLOSED,
    });
    return true;
  }
}
