import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Base62Service } from '@app/shared/base62/base62.service';
import { CacheService } from '@app/shared/cache/cache.service';
import { INewUrl, IUrl } from '@app/shared/interfaces/url/url.interface';
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

    await this.cacheService.set(code, input.url);

    return urlData;
  }

  async getUrlByCode(code: string): Promise<string | null> {
    const url = await this.cacheService.get<string>(code);
    if (url) {
      return url;
    }

    const existingUrl = await this.urlRepository.findOne({ where: { code } });
    if (!existingUrl) {
      return null;
    }

    await this.cacheService.set(code, existingUrl.url);

    return existingUrl.url;
  }
}
