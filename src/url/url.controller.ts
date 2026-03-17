import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';

import { Response } from 'express';

import { AppCodes } from '@app/shared/app-codes.enum';
import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';
import { AppResponse } from '@app/shared/app-response.dto';
import { ICurrentUser } from '@app/shared/interfaces/user/users.interface';
import { Authenticated, CurrentUser } from '@app/shared/jwt.guard';

import { CacheRedirectInterceptor } from './interceptors/url-cache-redirect.interceptor';
import { CreateUrlRequest } from './requests/create-url.request';
import { GetUrlParamDto } from './requests/get-url.request';

import { UrlService } from './url.service';

@Controller('u')
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly logger: AppLoggerService,
  ) {}

  @Post('/')
  @Authenticated()
  async createShortUrl(
    @CurrentUser() user: ICurrentUser,
    @Body() newUrl: CreateUrlRequest,
  ): Promise<AppResponse<string>> {
    const url = await this.urlService.createUrl(newUrl, user.id);
    return new AppResponse({
      code: AppCodes.URL_CREATED,
      data: url.code,
    });
  }

  @Get(':code')
  @UseInterceptors(CacheRedirectInterceptor)
  async handleShortCode(@Param() params: GetUrlParamDto, @Res() response: Response): Promise<void> {
    const fullUrl = await this.urlService.getUrlByCode(params.code);
    if (!fullUrl) {
      throw new NotFoundException();
    }

    return response.redirect(fullUrl);
  }
}
